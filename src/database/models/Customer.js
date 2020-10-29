const { model, Schema } = require('mongoose')

const DOCUMENT_NAME = 'Customer';
const COLLECTION_NAME = 'customers';

const schema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true        
    }
})

schema.path('email').validate(email => {
   const emailRegex = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/
   return emailRegex.test(email)
})

module.exports = model(DOCUMENT_NAME, schema, COLLECTION_NAME);