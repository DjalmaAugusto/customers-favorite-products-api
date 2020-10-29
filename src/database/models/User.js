const { model, Schema } = require('mongoose')
const { v4: uuidv4 } = require('uuid');

const DOCUMENT_NAME = 'User';
const COLLECTION_NAME = 'users';

const schema = new Schema({
    id: {
        type: String,        
        default: uuidv4()
    },
    username: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    password: {
        type: String,
        required: true  
    }
})

module.exports = model(DOCUMENT_NAME, schema, COLLECTION_NAME);