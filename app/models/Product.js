import ProductType from "./ProductType";
import log4js from 'log4js';

const log = log4js.getLogger('product');

const UNDEFINED = "UNDEFINED"

export default class Product {

    constructor(data = {}) {
        this._data = data
        this._data.title = data.title
        this._data.type = this.retrieveDatatype(data.title)
        this._data.img = ProductType[this._data.type]
    }

    toJson() {
        return this._data
    }

    retrieveDatatype(title) {
        if (!title) return UNDEFINED
        const foundType = Object.keys(ProductType).find((type) => {
            return (title.toUpperCase().indexOf(type) > -1)
        })
        return foundType || UNDEFINED
    }

    getType() {
        return this._data.type
    }

    getTitle() {
        return this._data.title
    }

    getImg() {
        return this._data.img
    }
}
