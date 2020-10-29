const express = require("express")
const Customer = require('../../../database/repositories/Customer')
const requestHandler = require('../../../helpers/requestHandler')
const { NotFoundResource, DuplicateResource, BadRequest } = require('../../../helpers/errorHandler')

const router = express.Router()

//#region JSDoc
/**
 * @swagger
 * /customers:
 *  get:
 *    description: List all customers
 *    tags:
 *     - Customer
 *    security:
 *      - bearerAuth: []
 *    parameters:
 *     - in: query
 *       name: page
 *       schema:
 *        type: string
 *       required: true
 *       description: Page number
 *    responses:
 *      '200':
 *        description: Successfully response
 *        content:
 *          application/json:
 *           schema:
 *            type: object
 *            properties:
 *              meta:
 *               $ref: '#/components/schemas/meta'
 *              customers:
 *               type: array
 *               items:
 *                $ref: '#/components/schemas/customer'
 *      '400':
 *        description: Bad Request response
 *        content:
 *          application/json:
 *           schema:
 *            $ref: '#/components/schemas/error' 
 *      '401':
 *        description: Unauthorized response
 *        content:
 *          application/json:
 *           schema:
 *            $ref: '#/components/schemas/error' 
 */
//#endregion JsDoc
router.get('/', 
    requestHandler(async (req, res, next) => {
        const { page } = req.query
        if(!page || page === '0'){
            throw new BadRequest("Page not provided")
        }
        const customers = await Customer.findAll({ page })
        res.status(200).send({
            meta: {
                page: parseInt(page,10),
                page_size: 100
            },
            customers
        })
    })
)

//#region JSDoc
/**
 * @swagger
 * /customers/{email}/:
 *  get:
 *    description: Get a customer by email
 *    tags:
 *     - Customer
 *    security:
 *      - bearerAuth: []
 *    parameters:
 *     - in: path
 *       name: email
 *       schema:
 *        type: string
 *       required: true
 *       description: Email of customer
 *    responses:
 *      '200':
 *        description: Successfully response
 *        content:
 *          application/json:
 *           schema:
 *            $ref: '#/components/schemas/customer'
 *      '401':
 *        description: Unauthorized response
 *        content:
 *          application/json:
 *           schema:
 *            $ref: '#/components/schemas/error' 
 *      '404':
 *        description: Not found response
 *        content:
 *          application/json:
 *           schema:
 *            $ref: '#/components/schemas/error'             
 */
//#endregion JSDoc
router.get('/:email', 
    requestHandler(async (req, res, next) => {
        const customer = await Customer.findOne( { email: req.params.email })
        if(!customer) { throw new NotFoundResource ('Customer not found')}
        res.status(200).send(customer)
    })    
)

//#region JSDoc
/**
 * @swagger
 * /customers:
 *  post:
 *    description: Create a customer
 *    tags:
 *     - Customer
 *    security:
 *      - bearerAuth: []
 *    requestBody:
 *     description: definition of request body
 *     content:
 *      application/json:
 *       schema:
 *        $ref: '#/components/schemas/customer'
 *    responses:
 *      '201':
 *        description: Successfully response
 *      '400':
 *        description: Bad Request response
 *        content:
 *          application/json:
 *           schema:
 *            $ref: '#/components/schemas/error'
 *      '401':
 *        description: Unauthorized response
 *        content:
 *          application/json:
 *           schema:
 *            $ref: '#/components/schemas/error' 
 *      '409':
 *        description: Conflict response
 *        content:
 *          application/json:
 *           schema:
 *            $ref: '#/components/schemas/error'             
 */
//#endregion JSDoc
router.post('/', 
    requestHandler(async (req, res, next) => {
        const { email } = req.body
        const customer = await Customer.findOne( { email })
        if(customer) { throw new DuplicateResource ('Customer already created')}
        if(!/^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/.test(email)) {
            throw new BadRequest ('Email format is invalid')
        }
        await Customer.create( { customer: req.body } )      
        res.sendStatus(201)
    })
)

//#region JSDoc
/**
 * @swagger
 * /customers/{email}/:
 *  put:
 *    description: Update a customer
 *    tags:
 *     - Customer
 *    security:
 *      - bearerAuth: []
 *    parameters:
 *     - in: path
 *       name: email
 *       schema:
 *        type: string
 *       required: true
 *       description: Email of customer
 *    requestBody:
 *     description: definition of request body
 *     content:
 *      application/json:
 *       schema:
 *        type: object
 *        properties:
 *         name:
 *          type: string
 *    responses:
 *      '204':
 *        description: Successfully response
 *      '401':
 *        description: Unauthorized response
 *        content:
 *          application/json:
 *           schema:
 *            $ref: '#/components/schemas/error' 
 *      '404':
 *        description: Conflict response
 *        content:
 *          application/json:
 *           schema:
 *            $ref: '#/components/schemas/error'             
 */
//#endregion JSDoc
router.put('/:email', 
    requestHandler(async (req, res, next) => {
        const { email } = req.params
        const { name } = req.body
        let customer = await Customer.findOne( { email })
        if(!customer) { throw new NotFoundResource ('Customer not found')}
        await Customer.update({ customer: { email, name } })    
        res.sendStatus(204)
    })
)

//#region JSDoc
/**
 * @swagger
 * /customers/{email}/:
 *  delete:
 *    description: Delete a customer
 *    tags:
 *     - Customer
 *    security:
 *      - bearerAuth: []
 *    parameters:
 *     - in: path
 *       name: email
 *       schema:
 *        type: string
 *       required: true
 *       description: Email of customer
 *    responses:
 *      '204':
 *        description: Successfully response
 *      '401':
 *        description: Unauthorized response
 *        content:
 *          application/json:
 *           schema:
 *            $ref: '#/components/schemas/error' 
 *      '404':
 *        description: Conflict response
 *        content:
 *          application/json:
 *           schema:
 *            $ref: '#/components/schemas/error'             
 */
//#endregion JSDoc
router.delete('/:email', 
    requestHandler(async (req, res, next) => {
        const { email } = req.params
        let customer = await Customer.findOne( { email })
        if(!customer) { throw new NotFoundResource ('Customer not found')}
        await Customer.remove({ email })    
        res.sendStatus(204)
    })
)

module.exports = router