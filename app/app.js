import server from './server'
import config from './../config'
import log4js from 'log4js'
const log = log4js.getLogger('app')

server.listen(config.port, function () {
    log.info(`Server listening on port  ${server.address().port}`)
})
