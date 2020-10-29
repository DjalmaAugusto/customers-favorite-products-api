const { model, Schema, Mongoose } = require('mongoose')

const DOCUMENT_NAME = 'CustomerProducts';
const COLLECTION_NAME = 'customerProducts';

const schema = new Schema({
    productId: {
        type: String,
        required: true,
        trim: true
    },
    customerEmail: {
        type: String,
        required: true
    }
})

schema.index({ productId:1, customerEmail:1 }, { unique: true })

module.exports = model(DOCUMENT_NAME, schema, COLLECTION_NAME);