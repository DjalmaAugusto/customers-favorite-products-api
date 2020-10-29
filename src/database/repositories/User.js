const User = require('../models/User')

const findOne = async ( query ) => {
    return await User.findOne(query, '-_id -__v').lean().exec()
}

const create = async ( {user}) => { 
    return await User.create(user)
}

const remove = async ( {username}) => { 
    return await User.deleteOne({ username })
}

module.exports = {
    findOne,
    create,
    remove
}