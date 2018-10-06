import Product from './Product'

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