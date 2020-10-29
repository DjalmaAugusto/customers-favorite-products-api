const CustomerProduct = require('../models/CustomerProduct')

const findAll = async ({ customerEmail, page }) => {
    const limit = 100
    const skip = limit * (page - 1)
    return await CustomerProduct.find({ customerEmail }, null, { skip, limit }).lean().exec()
}

const findOne = async ({ customerEmail, productId }) => {
    return await CustomerProduct.findOne({ customerEmail, productId }).lean().exec()
}

const create = async ({ product })  => {
    return await CustomerProduct.create(product)
}

const update = async ({ product })  => {
    return await CustomerProduct.create(product)
}

const remove = async( { product } ) => {
    return await CustomerProduct.deleteOne(product)
}

const removeAll = async( { customerEmail } ) => {
    return await CustomerProduct.deleteMany({ customerEmail })
}

module.exports = {
    findAll,
    findOne,
    create,
    update,
    remove,
    removeAll
}