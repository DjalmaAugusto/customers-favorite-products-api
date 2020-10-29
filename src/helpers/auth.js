const jwt = require('jsonwebtoken')
const { JWT } = require('../config')
const User = require('../database/repositories/User')
const { Unauthorized, NotFoundResource } = require('./errorHandler')

const login = async ( { username, password }) => {
    const sessionUser = await User.findOne({ username })
    if(!sessionUser){
        throw new NotFoundResource("User not found")
    }
    const token = generateToken({ user: sessionUser, expiresIn: JWT.expiresIn })
    return {
        token,
        expiresIn: JWT.expiresIn
    }
}

const generateToken = ( { user, expiresIn } ) => {
    const payload = { id: user.id, username: user.username }
    return jwt.sign(payload, JWT.secret, { expiresIn });
}

const decodeToken = async token => {
    try {
        const isTokenValid = token && token.startsWith('Bearer ');

        if (!isTokenValid) {
            throw new Unauthorized('You are not authorized')
        }
        const cleanToken = token.replace('Bearer ', '');

        const { id } = jwt.verify(cleanToken, JWT.secret);
        const user = await User.findOne({ id });

        if (!user) {
            throw new Unauthorized('You are not authorized')
        }

        return user
    } catch (error) {
        throw new Unauthorized('You are not authorized')
    }
}

const refreshToken = async token => {
    const sessionUser = await decodeToken(token);
    const newToken = generateToken({ user: sessionUser, expiresIn: JWT.expiresIn })

    return {
        token: newToken,
        expiresIn: JWT.expiresIn
    }
}

module.exports = {
    login,
    decodeToken,
    refreshToken
}