const express = require("express")
const requestHandler = require('../../../helpers/requestHandler')
const { DuplicateResource} = require('../../../helpers/errorHandler')
const { login, refreshToken }  = require("../../../helpers/auth")

const User = require('../../../database/repositories/User')

const router = express.Router()

//#region JSDoc
/**
 * @swagger
 * /auth/signup:
 *  post:
 *    description: Create new user
 *    tags:
 *     - Auth
 *    requestBody:
 *     description: definition of request body
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/user'
 *    responses:
 *      '201':
 *        description: Successfully response
 *      '400':
 *        description: Bad Request response
 *        content:
 *          application/json:
 *           schema:
 *            $ref: '#/components/schemas/error'
 */
//#endregion JsDoc
router.post('/signup', 
    requestHandler(async(req, res, next) => {
        const { username } = req.body
        let user = await User.findOne({ username })
        if(user){
            throw new DuplicateResource ('Username already exists')
        }
        user = req.body
        await User.create( { user })
        res.sendStatus(201)
    })
)

//#region JSDoc
/**
 * @swagger
 * /auth/login:
 *  post:
 *    description: Login
 *    tags:
 *     - Auth
 *    requestBody:
 *     description: definition of request body
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/user'
 *    responses:
 *      '200':
 *        description: Successfully response
 *        content:
 *          application/json:
 *           schema:
 *            $ref: '#/components/schemas/token'
 *      '401':
 *        description: Unauthorized response
 *        content:
 *          application/json:
 *           schema:
 *            $ref: '#/components/schemas/error'
 */
//#endregion JsDoc
router.post('/login', 
    requestHandler(async(req, res, next) => {
        const { username, password } = req.body
        const token = await login( { username, password })
        res.status(200).json(token)
    })
)

//#region JSDoc
/**
 * @swagger
 * /auth/refresh-token:
 *  post:
 *    description: Refresh Token
 *    security:
 *      - bearerAuth: []
 *    tags:
 *     - Auth
 *    responses:
 *      '200':
 *        description: Successfully response
 *        content:
 *          application/json:
 *           schema:
 *            $ref: '#/components/schemas/token'
 *      '401':
 *        description: Unauthorized response
 *        content:
 *          application/json:
 *           schema:
 *            $ref: '#/components/schemas/error'
 */
//#endregion JsDoc
router.post('/refresh-token', 
    requestHandler(async(req, res, next) => {
        const token = req.headers.authorization
        const newToken = await refreshToken(token)
        res.status(200).json(newToken)
    })
)

module.exports = router