import log4js from 'log4js'
import _ from 'lodash'
import Tx from './models/Tx'
import request from './helpers/request'
import config from './../config'

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

                res.status(200).json({
                    ok: true,
                    result: endProduct.toJson()
                })
            }).catch((err) => {
                log.error('END_PRODUCT >>> ', err)
                res.status(500).json(err)
            })
        })

        app.get('/end-product-by-id', (req, res) => {
            request.get_by_key(req.params.id.toString()).then((result) => {

                const decodedTxs = result.result.map((it) => {
                    return Tx.fromSAPTX(it).toJson()
                })[0]

                log.info(decodedTxs.getPrevTxIds())

                var prevTxIds = decodedTxs.getPrevTxIds()

                res.status(200).json({
                    ok: true,
                    result: prevTxIds
                })
            }).catch((err) => {
                log.error('LIST >>> ', err)
                res.status(500).json(err)
            })

        })

        app.get('/origin-and-location', (req, res) => {
            request.get_by_key(req.params.id.toString()).then((result) => {

                const decodedTxs = result.result.map((it) => {
                    return Tx.fromSAPTX(it).toJson()
                })[0]

                log.info(decodedTxs.getPrevTxIds())

                var prevTxIds = decodedTxs.getPrevTxIds()

                res.status(200).json({
                    ok: true,
                    result: prevTxIds
                })
            }).catch((err) => {
                log.error('LIST >>> ', err)
                res.status(500).json(err)
            })

        })


    }

}
