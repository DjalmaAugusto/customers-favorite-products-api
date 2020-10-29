const chai = require('chai')
const chaiHttp = require('chai-http')
const should = chai.should()

const server = require('../../../../src/server')
const { loginWithTestUser, cleanTestUser, TEST_CUSTOMER, createTestCustomer, cleanTestCustomer, TEST_CUSTOMER_PRODUCT } = require('../../../common')

chai.use(chaiHttp)

describe('Customer Product Methods', function () {
    this.timeout(10000)
    let authorization = null

    before( done => {
        loginWithTestUser().then( ({ token }) => {
            authorization = `Bearer ${token}`
            createTestCustomer().then(done)
        })
    })

    this.afterAll(done => {
        cleanTestUser().then(done)
    })
    this.afterAll(done => {
        cleanTestCustomer().then(done)
    })

    it('unauthorized request', done => {
        chai.request(server)
            .post(`/v1/customers/${TEST_CUSTOMER.email}/products`)
            .send(TEST_CUSTOMER_PRODUCT)
            .end((err, res) => {
                should.not.exist(err)
                res.should.have.status(401)
                done()
            })
    })

    it('add product on list success', done => {
        chai.request(server)
            .post(`/v1/customers/${TEST_CUSTOMER.email}/products`)
            .send(TEST_CUSTOMER_PRODUCT)
            .set("authorization", authorization)
            .end((err, res) => {
                should.not.exist(err)
                res.should.have.status(201)
                done()
            })
    })
    it('add product on list error (customer not found)', done => {
        chai.request(server)
            .post(`/v1/customers/unknown_customer/products`)
            .send(TEST_CUSTOMER_PRODUCT)
            .set("authorization", authorization)
            .end((err, res) => {
                should.not.exist(err)
                res.should.have.status(404)
                res.body.should.be.a('object');
                res.body.should.have.property('message');
                res.body.should.have.property('message').eql('Customer not found')
                done()
            })
    })
    it('add product on list error (product not found)', done => {
        const unknownProduct = { productId: "test_id"}
        chai.request(server)
            .post(`/v1/customers/${TEST_CUSTOMER.email}/products`)
            .send(unknownProduct)
            .set("authorization", authorization)
            .end((err, res) => {
                should.not.exist(err)
                res.should.have.status(404)
                res.body.should.be.a('object');
                res.body.should.have.property('message');
                res.body.should.have.property('message').eql('Product not found')
                done()
            })
    })
    it('add product on list error (add duplicate product)', done => {
        chai.request(server)
            .post(`/v1/customers/${TEST_CUSTOMER.email}/products`)
            .send(TEST_CUSTOMER_PRODUCT)
            .set("authorization", authorization)
            .end((err, res) => {
                should.not.exist(err)
                res.should.have.status(409)
                res.body.should.be.a('object');
                res.body.should.have.property('message');
                res.body.should.have.property('message').eql('Product already added in the favorite list')
                done()
            })
    })

    it('get all favorite products success', done => {
        chai.request(server)
            .get(`/v1/customers/${TEST_CUSTOMER.email}/products`)
            .query({ page: 1 })
            .set("authorization", authorization)
            .end((err, res) => {
                should.not.exist(err)
                res.should.have.status(200)
                res.body.should.be.an('object')
                res.body.should.have.deep.property('meta')
                res.body.should.have.deep.property('products')

                res.body.products.should.be.an('array')   
                res.body.products[0].should.have.property('id')
                res.body.products[0].should.have.property('title')
                res.body.products[0].should.have.property('price')
                res.body.products[0].should.have.property('image')
                done()
            })
    })
    it('get all favorite products error', done => {
        chai.request(server)
            .get(`/v1/customers/unknown_customer/products`)
            .query({ page: 1 })
            .set("authorization", authorization)
            .end((err, res) => {
                should.not.exist(err)
                res.should.have.status(404)
                res.body.should.be.a('object');
                res.body.should.have.property('message');
                res.body.should.have.property('message').eql('Customer not found')
                done()
            })
    })
    
    it('get favorite product by id success', done => {
        chai.request(server)
            .get(`/v1/customers/${TEST_CUSTOMER.email}/products/${TEST_CUSTOMER_PRODUCT.productId}`)
            .set("authorization", authorization)
            .end((err, res) => {
                should.not.exist(err)
                res.should.have.status(200)
                res.body.should.be.an('object')   
                res.body.should.have.property('id')
                res.body.should.have.property('title')
                res.body.should.have.property('price')
                res.body.should.have.property('image')
                done()
            })
    })
    it('get favorite product by id error (customer not found)', done => {
        chai.request(server)
            .get(`/v1/customers/unknown_customer/products/${TEST_CUSTOMER_PRODUCT.productId}`)
            .set("authorization", authorization)
            .end((err, res) => {
                should.not.exist(err)
                res.should.have.status(404)
                res.body.should.be.a('object');
                res.body.should.have.property('message');
                res.body.should.have.property('message').eql('Customer not found')
                done()
            })
    })
    it('get favorite product by id error (product not found)', done => {
        chai.request(server)
            .get(`/v1/customers/${TEST_CUSTOMER.email}/products/unknown_product`)
            .set("authorization", authorization)
            .end((err, res) => {
                should.not.exist(err)
                res.should.have.status(404)
                res.body.should.be.a('object');
                res.body.should.have.property('message');
                res.body.should.have.property('message').eql('Product not found in the favorite list')
                done()
            })
    })

    it('delete favorite product of list error (customer not found)', done => {
        chai.request(server)
            .delete(`/v1/customers/unknown_customer/products/${TEST_CUSTOMER_PRODUCT.productId}`)
            .set("authorization", authorization)
            .end((err, res) => {
                should.not.exist(err)
                res.should.have.status(404)
                res.body.should.be.a('object');
                res.body.should.have.property('message');
                res.body.should.have.property('message').eql('Customer not found')
                done()
            })
    })
    it('delete favorite product of list error (product not found)', done => {
        chai.request(server)
            .delete(`/v1/customers/${TEST_CUSTOMER.email}/products/unknown_customer`)
            .set("authorization", authorization)
            .end((err, res) => {
                should.not.exist(err)
                res.should.have.status(404)
                res.body.should.be.a('object');
                res.body.should.have.property('message');
                res.body.should.have.property('message').eql('Product not found in the favorite list')
                done()
            })
    })
    it('delete favorite product of list success', done => {
        chai.request(server)
            .delete(`/v1/customers/${TEST_CUSTOMER.email}/products/${TEST_CUSTOMER_PRODUCT.productId}`)
            .set("authorization", authorization)
            .end((err, res) => {
                should.not.exist(err)
                res.should.have.status(204)
                done()
            })
    })
})