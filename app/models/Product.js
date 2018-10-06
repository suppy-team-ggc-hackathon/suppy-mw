export default class Product {

    constructor(data) {
        this._data = data
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
