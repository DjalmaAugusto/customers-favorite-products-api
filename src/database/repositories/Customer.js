const Customer = require('../models/Customer')
const CustomerProduct = require('./CustomerProduct')

const findAll = async ({ page }) => {
    const limit = 100
    const skip = limit * (page - 1)
    return await Customer.find({}, '-_id -__v', { skip, limit }).lean().exec()
}

const findOne = async ( {email} ) => {
    return await Customer.findOne({ email }, '-_id -__v').lean().exec()
}

const create = async ( {customer}) => { 
    return await Customer.create(customer)
}

const update = async ( {customer}) => {
    return await Customer.updateOne({ email: customer.email }, { name: customer.name })
}

const remove = async ( { email }) => {
    await CustomerProduct.removeAll({ customerEmail: email })
    return await Customer.deleteOne({ email })
}

module.exports = {
    findAll,
    findOne,
    create,
    update,
    remove
}