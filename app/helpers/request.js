import request from 'request'
import log4js from 'log4js'
import config from './../../config'
import uuid from 'uuid/v1'
import Tx from '../models/Tx'

const log = log4js.getLogger('request')
log.level = config.log_level

const toHex = (data) => Buffer.from(JSON.stringify(data), 'utf8').toString('hex')

const buildSapDataToPOST = (txKey, data) => ({
    "method": "publish",
    "params": [
        config.sap_api.stream,
        txKey,
        toHex(data)
    ]
})

const buildSapDataToLIST = () => ({
    "method": "liststreamitems",
    "params": [
        config.sap_api.stream,
        false, // verbose?
        1000 // count
    ]
})

const buildSapDataToRetrieveByKey = (sapKey) => ({
    "method": "liststreamkeyitems",
    "params": [
        config.sap_api.stream,
        sapKey
    ]
})


export default {
    post: (data) => {

        const txKey = uuid()
        const sapData = buildSapDataToPOST(txKey, data)

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
                    resolve(txKey)
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
                    resolve(data)
                }
            })
        })
    },

    get_by_key: (sapKey) => {

        const sapData = buildSapDataToRetrieveByKey(sapKey)
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

    find_by_id: (sapKey, txs) => {
        return txs.find((tx) => tx.getSapKey() === sapKey)
    },

    iterate: (current, depth, txs) => {
        var children = current.getPrevTxIds();
        var tree = []
        log.info("we entered iterate")
        for (var i = 0, len = children.length; i < len; i++) {
            iterate(find_by_id(children[i],txs), depth + 1);
            tree.push(current)
        }
        return tree
    }
   


}
