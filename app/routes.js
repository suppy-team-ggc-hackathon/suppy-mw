import log4js from 'log4js'
import _ from 'lodash'
import Tx from './models/Tx'
import request from './helpers/request'
import geoHelper from './helpers/geo-helper'
import config from './../config'

var NodeGeocoder = require('node-geocoder');

var options = {
  provider: 'mapquest',

  // Optionnal depending of the providers
  apiKey: "iNAZfAMXpufnTapwIwA56yBJsVjRB7Zz",
  httpAdapter: 'https' // Default
};

var geocoder = NodeGeocoder(options);

export default {
    configure: function (app) {

        const log = log4js.getLogger('routes')
        log.level = config.log_level

        /**
         * Open Routes
         */

        app.post('/tx', (req, res, next) => {

            log.info("POST >>> ", req.body)

            const tx = new Tx(req.body)

            request.post(tx.toJson()).then((result) => {
                res.status(200).json({
                    ok: true,
                    result
                })
            }).catch((err) => {
                log.error('POST >>> ', err)
                res.status(500).json(err)
            })
        })

        app.get('/tx', (req, res) => {
            request.list().then((result) => {

                let txs = result.result.map((it) => Tx.fromSAPTX(it))

                txs = _.sortBy(txs, (tx) => tx.getDate()).map((tx) => tx.toJson())

                res.status(200).json({
                    ok: true,
                    result: txs,
                    length: txs.length
                })
            }).catch((err) => {
                log.error('LIST >>> ', err)
                res.status(500).json(err)
            })
        })

        app.get('/tx/:id', (req, res) => {
            request.get_by_key(req.params.id.toString()).then((result) => {
                
                const decodedTxs = result.result.map((it) => {
                    return Tx.fromSAPTX(it).toJson()
                })[0]

                res.status(200).json({
                    ok: true,
                    result: decodedTxs
                })
            }).catch((err) => {
                log.error('LIST >>> ', err)
                res.status(500).json(err)
            })
        })

        app.get('/end-product', (req, res) => {
            request.list().then((result) => {

                const decodedTxs = result.result.map((it) => Tx.fromSAPTX(it))
                const endProduct = decodedTxs.find((it) => it.getPrevTxIds().length > 1)

                let co2 = 0

                endProduct.getPrevTxIds().forEach((txId) => {
                    const parentTx = decodedTxs.find((tx) => tx.getSapKey() === txId)
                    if (parentTx) co2 += parentTx.getCO2()
                })

                res.status(200).json({
                    ok: true,
                    result: endProduct.toJson(),
                    co2Total: co2
                })
            }).catch((err) => {
                log.error('END_PRODUCT >>> ', err)
                res.status(500).json(err)
            })
        })

        app.get('/end-product-by-id/:id', (req, res) => {
            request.get_by_key(req.params.id.toString()).then((result) => {

                const decodedTxs = result.result.map((it) => {
                    return Tx.fromSAPTX(it)
                })[0]

                log.info(decodedTxs.getPrevTxIds())

                var prevTxIds = decodedTxs.getPrevTxIds()
                log.info(prevTxIds)

                res.status(200).json({
                    ok: true,
                    result: prevTxIds
                })
            }).catch((err) => {
                log.error('LIST >>> ', err)
                res.status(500).json(err)
            })

        })

        //TEST for if ubiquation now isnt undefined anymore

        app.get('/origin-and-location/:id', (req, res) => {
            request.list().then((result) => {

                const id = req.params.id.toString()
                let txs = result.result.map((it) => Tx.fromSAPTX(it))

                //STEP 1 : check if found works
                let found = txs.find((tx) => tx.getSapKey() === id)

                if (!found) {
                    res.status(404).json("Not found sapKey >>> ", id)
                    return
                }
                
                //STEP 2: traversing to the very origin
                while (found.getPrevTxIds().length > 0) {
                    found = request.find_by_id(found.getPrevTxIds()[0], txs)
                }

                //STEP 3: calculate origin geocoder
                geocoder.reverse(found.getLocation(), function(err, geoRes) {
                    log.info("GEOCODING >>> RAW >>> ", geoRes)
                    const address = geoRes && geoRes.length ? geoRes[0] : {}

                    if (err) {
                        log.error('GEOCODING >>> ', err)
                        res.status(500).json(err)
                    } else {
                        res.status(200).json({
                            ok: true,
                            result: Object.assign(
                                {},
                                found.toJson(),
                                {originAddress: geoHelper.findClosestAddress(address)}
                            )
                        })
                    }
                });

            }).catch((err) => {
                log.error('GET origin-and-location >>> ', err)
                res.status(500).json(err)
            })

        })

        app.get('/supply-chain/:id', (req, res) => {
            request.list().then((result) => {

                var id = req.params.id.toString()
                let txs = result.result.map((it) => Tx.fromSAPTX(it))

                var found = txs.find(function(element) {
                    return element.getSapKey() == id
                  });
                
                log.info('found prevTxIds >>>', found.getPrevTxIds())
                var supplychain = []

                while (found.getPrevTxIds().length > 0){
                    supplychain.push(found) //Jsonfiying needed?
                    found = request.find_by_id(found.getPrevTxIds(), txs)
                }

                supplychain.push(found)

                res.status(200).json({
                    ok: true,
                    supplychain: supplychain //.toJSON() needed?
                })
            }).catch((err) => {
                log.error('LIST >>> ', err)
                res.status(500).json(err)
            })
        })

            // Just generally test
        app.get('/whole-tree-co2/:id', (req, res) => {
            request.list().then((result) => {

                var id = req.params.id.toString()
                let txs = result.result.map((it) => Tx.fromSAPTX(it))

                var found = txs.find(function(element) {
                    return element.getSapKey() == id
                    });
                
                log.info('found prevTxIds >>>', found.getPrevTxIds())
                    
                var tree = []
                var co2 = []

                /*while (found.getPrevTxIds().length > 0){ 
                    for( var prev_key in found.getPrevTxIds()) {
                        tree.push(found)
                        co2 += found.getCO2()
                        found = request.find_by_id(found.getPrevTxIds(), txs) 
                    }
                }*/
                tree = request.iterate(found, 0,txs);

                res.status(200).json({
                    ok: true,
                    tree: tree,
                    co2: co2 //.toJSON() needed?
                })
            }).catch((err) => {
                log.error('LIST >>> ', err)
                res.status(500).json(err)
            })
        })

        app.get('/co2-emission/:id', (req, res) => {
            request.list().then((result) => {

                var id = req.params.id.toString()
                let txs = result.result.map((it) => Tx.fromSAPTX(it))

                var found = txs.find(function(element) {
                    return element.getSapKey() == id
                    });
                
                log.info('found prevTxIds >>>', found.getPrevTxIds())
                var supplychain 

                /*while (found.getPrevTxIds().length > 0){
                    supplychain.push(found) //Jsonfiying needed?
                    found = request.find_by_id(found.getPrevTxIds(), txs)
                }*/

                supplychain = request.iterate(found, 0);

                res.status(200).json({
                    ok: true,
                    supplychain: supplychain //.toJSON() needed?
                })
            }).catch((err) => {
                log.error('LIST >>> ', err)
                res.status(500).json(err)
            })

        })



    }

}
