const { decodeToken  } = require('../helpers/auth')

module.exports = async (req, res, next) => {
    try {
        const token = req.headers.authorization
        await decodeToken(token)
        next()
    } catch (error) {
        next(error)
    }
}