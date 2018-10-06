import log4js from 'log4js'

const log = log4js.getLogger('config')

export default (() => {

    const configPath = `./configs/${process.env.NODE_ENV}_config.json`
    log.info(`Loading config [${configPath}] ...`)

    return require(configPath)
})()