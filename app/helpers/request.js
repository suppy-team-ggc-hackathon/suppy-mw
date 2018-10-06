import request from 'request'
import log4js from 'log4js'
import config from './../../config'
import uuid from 'uuid/v1'

const log = log4js.getLogger('request')
log.level = config.log_level

const toHex = (data) => Buffer.from(JSON.stringify(data), 'utf8').toString('hex')

const buildSapDataToPOST = (data) => ({
    "method": "publish",
    "params": [
        "suppy_stream",
        uuid(), // tx key
        toHex(data)
    ]
})

const buildSapDataToLIST = () => ({
    "method": "liststreamitems",
    "params": [
        "suppy_stream"
    ]
})

const buildSapDataToRetrieveByKey = (key) => ({
    "method": "liststreamkeyitems",
    "params": [
        "suppy_stream",
        key
    ]
})


export default {
    post: (data) => {

        log.debug('POST data >>> ', data)

        const sapData = buildSapDataToPOST(data)

        log.debug('POST sapData >>> ', sapData)

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
                    log.debug('POST sapData RESPONSE SUCCESS >>> ', data)
                    resolve(data)
                }
            })
        })
    },

    list: () => {

        const sapData = buildSapDataToLIST()

        log.debug('LIST sapData >>> ', sapData)

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
                    log.error('LIST sapData RESPONSE ERROR >>> ', err)
                    reject(err)
                } else {
                    log.debug('LIST sapData RESPONSE SUCCESS >>> ', data)
                    resolve(data)
                }
            })
        })
    },

    get_by_key: (key) => {

        const sapData = buildSapDataToRetrieveByKey(key)
        log.debug('GET_BY_KEY sapData >>>', sapData)

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
                    log.error('LIST sapData RESPONSE ERROR >>> ', err)
                    reject(err)
                } else {
                    log.debug('LIST sapData RESPONSE SUCCESS >>> ', data)
                    resolve(data)
                }
            })
        })
    },


}
