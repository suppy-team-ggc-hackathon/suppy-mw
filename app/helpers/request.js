import request from 'request'
import log4js from 'log4js'
import config from './../../config'
import uuid from 'uuid/v1'

const log = log4js.getLogger('request')

const toHex = (data) => Buffer.from(JSON.stringify(data), 'utf8').toString('hex')

const buildSapData = (data) => ({
    "method": "publish",
    "params": ["suppy_stream", uuid(), toHex(data)]
})

export default {
    post: (data) => {

        log.info('POST data >>> ', data)

        const sapData = buildSapData(data)

        log.info('POST sapData >>> ', sapData)

        return new Promise(function(resolve, reject) {
            request({
                method: 'POST',
                url: config.sap_api.url,
                json: sapData,
                headers: {
                    "apikey": config.sap_api.key
                }
            }, (err, resp, data) => {
                if (err) {
                    log.error('POST sapData RESPONSE ERROR >>> ', err)
                    reject(err)
                } else {
                    log.error('POST sapData RESPONSE SUCCESS >>> ', data)
                    resolve(data)
                }
            })
        })
    }
}
