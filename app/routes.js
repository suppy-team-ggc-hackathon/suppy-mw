import log4js from 'log4js'
import Tx from './models/Tx'
import request from './helpers/request'

export default {
    configure: function (app) {

        const log = log4js.getLogger('routes')

        /**
         * Open Routes
         */

        app.post('/tx', (req, res) => {

            log.info('req.body >>> ', req.body)

            const tx = new Tx(req.body)

            log.info('tx >>> ', tx)

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
            res.status(200).json({
                ok: true,
                result: 'get tx'
            })
        })
    }
}
