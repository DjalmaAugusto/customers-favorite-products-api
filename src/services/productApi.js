const { PRODUCT_SERVICE_URL  } = require('../config')
const axios = require('axios')

const productExists = async ( { productId }) => {
    try {
        await axios.get(`${PRODUCT_SERVICE_URL}/${productId}/`)
        return true
    } catch (error) {
        return false
    }
}

const getProduct = async ( { productId }) => {
    try {        
        const response = await axios.get(`${PRODUCT_SERVICE_URL}/${productId}/`)
        /**
         * Product API has an behavior, when it receive a wrong product id like 123.
         * It is using the 123 value as page number and return a list of products
         */
        if(response.data.meta) return null
        else return response.data
    } catch (error) {
        return null
    }
}

module.exports = {
    productExists,
    getProduct
}