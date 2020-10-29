const chai = require('chai')
const chaiHttp = require('chai-http')
const faker = require('faker')
const should = chai.should()

const server = require('../../../../src/server')
const { TEST_CUSTOMER, loginWithTestUser, cleanTestUser } = require('../../../common')

chai.use(chaiHttp)

describe('Customer Methods', function () {

    let authorization = null
    const customer = TEST_CUSTOMER

    before( done => {
        loginWithTestUser().then( ({ token }) => {
            authorization = `Bearer ${token}`
            done()
        })
    })

    this.afterAll(done => {
        cleanTestUser().then(done)
    })

    it('unauthorized request', done => {
        chai.request(server)
            .post('/v1/customers')
            .send(customer)
            .end((err, res) => {
                should.not.exist(err)
                res.should.have.status(401)
                done()
            })
    })

    it('create customer with success', done => {
        chai.request(server)
            .post('/v1/customers')
            .send(customer)
            .set("authorization", authorization)
            .end((err, res) => {
                should.not.exist(err)
                res.should.have.status(201)
                done()
            })
    })

    it('get all customers with success', done => {
        chai.request(server)
            .get('/v1/customers')
            .query({ page: 1 })
            .set("authorization", authorization)
            .end((err, res) => {
                should.not.exist(err)
                res.should.have.status(200)
                res.body.should.be.an('object')
                res.body.should.have.deep.property('meta')
                res.body.should.have.deep.property('customers')

                res.body.customers.should.be.an('array')           
                res.body.customers[0].should.have.property('name')
                res.body.customers[0].should.have.property('email')
                done()
            })
    })
    it('get customer by email', done => {
        chai.request(server)
            .get(`/v1/customers/${TEST_CUSTOMER.email}`)
            .set("authorization", authorization)
            .end((err, res) => {
                should.not.exist(err)
                res.should.have.status(200)
                res.body.should.be.an('object')           
                res.body.should.have.property('name', TEST_CUSTOMER.name)
                res.body.should.have.property('email', TEST_CUSTOMER.email)
                done()
            })
    })
    it('get customer by email error', done => {
        chai.request(server)
            .get(`/v1/customers/unknown_customer`)
            .set("authorization", authorization)
            .end((err, res) => {
                should.not.exist(err)
                res.should.have.status(404)
                done()
            })
    })

    it('update customer success', done => {
        const updatedCustomer = {...customer, name: faker.name.firstName() }
        chai.request(server)
            .put(`/v1/customers/${TEST_CUSTOMER.email}`)
            .send(updatedCustomer)
            .set("authorization", authorization)
            .end((err, res) => {
                should.not.exist(err)
                res.should.have.status(204)
                done()
            })
    })
    it('update customer error', done => {
        const updatedCustomer = {...customer, name: faker.name.firstName() }
        chai.request(server)
            .put(`/v1/customers/unknown_customer`)
            .send(updatedCustomer)
            .set("authorization", authorization)
            .end((err, res) => {
                should.not.exist(err)
                res.should.have.status(404)
                done()
            })
    })

    it('delete customer success', done => {
        chai.request(server)
            .delete(`/v1/customers/${TEST_CUSTOMER.email}`)
            .set("authorization", authorization)
            .end((err, res) => {
                should.not.exist(err)
                res.should.have.status(204)
                done()
            })
    })
    it('delete customer error', done => {
        chai.request(server)
            .delete(`/v1/customers/${TEST_CUSTOMER.email}`)
            .set("authorization", authorization)
            .end((err, res) => {
                should.not.exist(err)
                res.should.have.status(404)
                done()
            })
    })

})