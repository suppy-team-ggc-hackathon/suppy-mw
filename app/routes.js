import log4js from 'log4js'
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

        app.post('/tx', (req, res) => {

            log.debug('req.body >>> ', req.body)

            const tx = new Tx(req.body)

            log.debug('tx >>> ', tx)

            request.post(tx.toJson()).then((result) => {
                res.status(200).json({
                    ok: true,
                    result
                })
            }).catch((err) => {
                res.status(500).json(err)
            })
        })

        app.get('/tx', (req, res) => {
            request.list().then((result) => {

                const decodedTxs = result.result.map((it) => {
                    log.debug('Tx LIST ITEM >>> RAW Tx >>> ', it)
                    return Tx.fromSAPTX(it)
                })

                log.debug('Tx LIST >>> decodedTxs >>> ', decodedTxs)

                res.status(200).json({
                    ok: true,
                    decodedTxs
                })
            }).catch((err) => {
                res.status(500).json(err)
            })
        })

        app.get('/tx/:id', (req, res) => {
            request.get_by_key(req.params.id.toString()).then((result) => {
                
                const decodedTxs = result.result.map((it) => {
                    log.debug('Tx LIST ITEM >>> RAW Tx >>> ', it)
                    return Tx.fromSAPTX(it)
                })[0]


                log.debug('Tx GET_KEY_BY_ELEMENT >>> decodedTxs >>> ', decodedTxs)

                res.status(200).json({
                    ok: true,
                    decodedTxs
                })
            }).catch((err) => {
                res.status(500).json(err)
            })
        })
    }

}
