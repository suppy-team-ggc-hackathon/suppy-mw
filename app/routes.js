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

                const decodedTxs = result.result.map((it) => {
                    return Tx.fromSAPTX(it).toJson()
                })

                res.status(200).json({
                    ok: true,
                    result: decodedTxs,
                    length: decodedTxs.length
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
    }

}
