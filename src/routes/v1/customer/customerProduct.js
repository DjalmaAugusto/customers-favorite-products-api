const express = require("express")
const CustomerProduct = require('../../../database/repositories/CustomerProduct')
const Customer = require('../../../database/repositories/Customer')

const productService = require('../../../services/productApi')
const requestHandler = require('../../../helpers/requestHandler')
const { NotFoundResource, DuplicateResource, BadRequest } = require('../../../helpers/errorHandler')
const { getAsync: redisGet, setAsync: redisSet  } = require('../../../database/cache/redisClient')

const router = express.Router()

//#region JSDoc
/**
 * @swagger
 * /customers/{email}/products/:
 *  get:
 *    description: Get all favorite products of customer by email
 *    tags:
 *     - Customer Product
 *    security:
 *      - bearerAuth: []
 *    parameters:
 *     - in: path
 *       name: email
 *       schema:
 *        type: string
 *       required: true
 *       description: Email of customer
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
 *              products:
 *               type: array
 *               items:
 *                $ref: '#/components/schemas/product'
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
router.get('/:email/products/', 
    requestHandler(async (req, res, next) => {
        const { email } = req.params
        const { page } = req.query
        if(!page || page === '0'){
            throw new BadRequest("Page not provided")
        }
        const customer = await Customer.findOne( { email })
        if(!customer) { throw new NotFoundResource ('Customer not found')}
        const customerProducts = await CustomerProduct.findAll( { customerEmail: email, page })
        const promises = customerProducts.map( async ({ productId }) => {
            let product = await redisGet(productId)
            if(!product){
                product = await productService.getProduct({ productId })
                await redisSet(productId, JSON.stringify(product), 'EX', 60 * 60 * 12)
            } else {
                product = JSON.parse(product)
            }
            return product
        })
        products = await Promise.all(promises)
        res.status(200).send({
            meta: {
                page: parseInt(page,10),
                page_size: 100
            },
            products
        })
    })
)

//#region JSDoc
/**
 * @swagger
 * /customers/{email}/products/{productId}:
 *  get:
 *    description: Get the favorite product of customer by product id
 *    tags:
 *     - Customer Product
 *    security:
 *      - bearerAuth: []
 *    parameters:
 *     - in: path
 *       name: email
 *       schema:
 *        type: string
 *       required: true
 *       description: Email of customer
 *     - in: path
 *       name: productId
 *       schema:
 *        type: string
 *       required: true
 *       description: Id of product
 *    responses:
 *      '200':
 *        description: Successfully response
 *        content:
 *          application/json:
 *           schema:
 *            $ref: '#/components/schemas/product'
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
router.get('/:email/products/:productId', 
    requestHandler(async (req, res, next) => {
        const { email, productId } = req.params
        const customer = await Customer.findOne( { email })
        if(!customer) { throw new NotFoundResource ('Customer not found')}
        const customerProduct = await CustomerProduct.findOne( { customerEmail: email, productId })
        if(!customerProduct) { throw new NotFoundResource ('Product not found in the favorite list')}
        let product = await redisGet(productId)
        if(!product){
            product = await productService.getProduct({ productId })
            if(!product){ throw new NotFoundResource ('Product not found') }
            await redisSet(productId, JSON.stringify(product), 'EX', 60 * 60 * 12)
        } else {
            product = JSON.parse(product)
        }

        const { id, title, image, price, reviewScore } = product
        res.status(200).send({ id, title, image, price, reviewScore })
    })
)

//#region JSDoc
/**
 * @swagger
 * /customers/{email}/products/:
 *  post:
 *    description: Add favorite products in the customer list
 *    tags:
 *     - Customer Product
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
 *        $ref: '#/components/schemas/customerProduct'
 *    responses:
 *      '200':
 *        description: Successfully response
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
 *      '409':
 *        description: Conflict response
 *        content:
 *          application/json:
 *           schema:
 *            $ref: '#/components/schemas/error'          
 */
//#endregion JSDoc
router.post('/:email/products/', 
    requestHandler(async (req, res, next) => {
        const { email } = req.params
        const { productId } = req.body
        const customer = await Customer.findOne( { email })
        if(!customer) { throw new NotFoundResource ('Customer not found')}
        let customerProduct = await CustomerProduct.findOne( { customerEmail: email, productId })
        if(customerProduct) { throw new DuplicateResource ('Product already added in the favorite list')}
        let product = await productService.getProduct({ productId })
        if(!product){ throw new NotFoundResource ('Product not found') }
        await redisSet(productId, JSON.stringify(product), 'EX', 60 * 60 * 12)
        customerProduct = { productId, customerEmail: email }
        await CustomerProduct.create({ product: customerProduct })
        res.sendStatus(201)
    })
)

//#region JSDoc
/**
 * @swagger
 * /customers/{email}/products/{productId}:
 *  delete:
 *    description: Remove the product of customer list
 *    tags:
 *     - Customer Product
 *    security:
 *      - bearerAuth: []
 *    parameters:
 *     - in: path
 *       name: email
 *       schema:
 *        type: string
 *       required: true
 *       description: Email of customer
 *     - in: path
 *       name: productId
 *       schema:
 *        type: string
 *       required: true
 *       description: Id of product
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
router.delete('/:email/products/:productId',
    requestHandler(async (req, res, next) => {
        const { email, productId } = req.params
        const customer = await Customer.findOne( { email })
        if(!customer) { throw new NotFoundResource ('Customer not found')}
        let product = await CustomerProduct.findOne( { customerEmail: email, productId })
        if(!product) { throw new NotFoundResource ('Product not found in the favorite list')}
        await CustomerProduct.remove({ product: { customerEmail: req.params.email, productId: req.params.productId } })
        res.sendStatus(204)
    })
)

module.exports = router