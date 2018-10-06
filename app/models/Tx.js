import hex2ascii from 'hex2ascii'
import Product from './Product'
import log4js from "log4js";
import config from "./../../config";

const log = log4js.getLogger('Tx')
log.level = config.log_level

export default class Tx {

    constructor(data = {}) {
        this._data = data
        this._data.product_data = new Product(data.product_data).toJson()
    }

    toJson() {
        return this._data
    }

    isValid() {
        return this.getSapKey() && this.getDate()
    }

    toString() {
        return JSON.stringify(this._data)
    }

    static fromSAPTX(sapTx) {


        const sapTxDataDecoded = hex2ascii(sapTx.data)

        log.warn('fromSAPTX >>> DECODED >>> ', sapTxDataDecoded)

        let result

        try {
            const data = JSON.parse(sapTxDataDecoded)
            data.sapKey = sapTx.key
            result = new Tx(data)
        } catch (e) {
            log.warn('fromSAPTX >>> invalid JSON >>> ', sapTxDataDecoded)
            result = new Tx()
        }

        log.warn('fromSAPTX >>> RESULT >>> ', result)

        if (result.isValid()) return result
        else return new Tx()
    }

    getSapKey() {
        return this._data.sapKey
    }

    getPrevTxIds() {
        return this._data.prev_tx_ids ? this._data.prev_tx_ids : []
    }

    getDate() {
        return this._data.date
    }

    getLocation() {
        return {
            lat: this._data.location ? this._data.location.lat : null,
            lng: this._data.location ? this._data.location.lng : null
        }
    }

    getSupplierId() {
        return this._data.supplier_id
    }

    getSupplierType() {
        return this._data.supplier_type
    }

    getProduct() {
        return this._data.product_data
    }

    getCO2() {
        return this._data.co2
    }

}