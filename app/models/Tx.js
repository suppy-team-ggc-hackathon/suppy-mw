import hex2ascii from 'hex2ascii'
import Product from './Product'
import log4js from "log4js";
import config from "../../config";

const log = log4js.getLogger('Tx')
log.level = config.log_level

export default class Tx {

    constructor(data) {
        this._data = data
    }

    toJson() {
        return this._data
    }

    toString() {
        return JSON.stringify(this._data)
    }

    static fromSAPTX(sapTx) {
        log.debug('fromSAPTX >>> sapTx RAW >>> ', sapTx.data)
        const sapTxDataDecoded = hex2ascii(sapTx.data)
        log.debug('fromSAPTX >>> sapTxData DECODED >>> ', sapTxDataDecoded)

        let result

        try {
            const data = JSON.parse(sapTxDataDecoded)
            result = new Tx(data)
        } catch (e) {
            log.warn('fromSAPTX >>> invalid JSON >>> ', sapTxDataDecoded)
            result = sapTxDataDecoded
        }

        return result
    }

    getPrevTxIds() {
        return this._data.prev_tx_ids
    }

    getDate() {
        return this._data.date
    }

    getLocation() {
        return {
            lat: this._data.location.lat,
            lng: this._data.location.lng
        }
    }

    getSupplierId() {
        return this._data.supplier_id
    }

    getSupplierType() {
        return this._data.supplier_type
    }

    getProduct() {
        return new Product(this._data.product_data)
    }

    getCO2() {
        return this._data.co2
    }

}