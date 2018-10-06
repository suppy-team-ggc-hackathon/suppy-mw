import log4js from 'log4js'

export default {
    configure: function (app) {

        const log = log4js.getLogger('routes')

        /**
         * Open Routes
         */

        app.post('/tx', (req, res) => {

            res.status(200).json({
                ok: true,
                result: req.body
            })

            // res.status(500).json(err)
        })

        app.get('/tx', (req, res) => {
            res.status(200).json({
                ok: true,
                result: 'get tx'
            })
        })
    }
}
