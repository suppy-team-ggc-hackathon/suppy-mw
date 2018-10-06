import ProductType from "./ProductType";
import log4js from 'log4js';
const log = log4js.getLogger('product');

export default class Product {

    constructor(data) {
        log.info('Product Constructor WE ARE IN')
        log.info('Product CONSTRUCTOR >>> input_data' + JSON.stringify(data))
        this._data = {}
        this._data.title = data.title
        log.info('Product Constructor input data title', this._data.title)
        this._data.type = this.retrieveDatatype(data.title)
        log.info('Product Constructor >>> datatype',this._data.type)
        this._data.img = ProductType[this._data.type]
        log.info('Product Constructor img ', this._data.img)
    }

    retrieveDatatype(title){
        log.info('retrieveDATATYPE we are in')
        var datatype

        Object.keys(ProductType).forEach(function(type) {
            log.info('This is the Type Hype!', type)
            log.info(title)
            if (title.includes(type)){
                log.info(type)
                datatype = type;
                return datatype
            }
        });
        datatype = "UNDEFINED"
        return datatype

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
