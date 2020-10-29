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
        return response.data //product
    } catch (error) {
        return null
    }
}

module.exports = {
    productExists,
    getProduct
}