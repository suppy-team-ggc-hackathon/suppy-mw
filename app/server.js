import express from 'express'
import bodyparser from 'body-parser'
import cors from 'cors'
import fs from 'fs'
import https from 'https'
import http from 'http'
import log4js from 'log4js'
import routes from './routes'
import config from './../config'

const env = process.env.NODE_ENV
const isDev = env === 'dev' || env === 'test'

log4js.configure({
    appenders: {console: {type: 'console', layout: {type: isDev ? 'colored' : 'basic'}}},
    categories: {default: {appenders: ['console'], level: isDev ? 'DEBUG' : 'INFO'}}
})

const log = log4js.getLogger('server')
log.warn('Environment set to [' + env + ']')



const app = express()
app.use(bodyparser.urlencoded({extended: true}))
app.use(bodyparser.json())
app.use(cors())

routes.configure(app)

export default (() => {
    if (config.https) {
        log.warn('HTTPS is using')

        return https.createServer({
            key: fs.readFileSync(__dirname + '/cert/key.pem'),
            cert: fs.readFileSync(__dirname + '/cert/cert.pem')

        }, app)

    } else {
        return http.createServer(app)
    }
})()
