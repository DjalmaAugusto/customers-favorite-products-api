const chai = require('chai')
const chaiHttp = require('chai-http')
const should = chai.should()

const server = require('../../../../src/server')
const { TEST_USER, getTestUser, cleanTestUser } = require('../../../common')

chai.use(chaiHttp)

describe('Authorization and Authentication', function () {

    let user = TEST_USER
    let token = null

    this.afterAll(done => {
        cleanTestUser().then(done)
    })
    
    it('create user with success ', done => {
        chai.request(server)
            .post('/v1/auth/signup')
            .send(user)
            .end((err, res) => {
                should.not.exist(err)
                res.should.have.status(201)
                done()
            })
    })
    it('create user with error', done => {
        chai.request(server)
            .post('/v1/auth/signup')
            .send(user)
            .end((err, res) => {
                should.not.exist(err)
                res.should.have.status(409)
                done()
            })
    })
    
    it('login with success', function (done) {
        chai.request(server).post('/v1/auth/login')
        .send(user)
        .end((err, res) => {
            should.not.exist(err)
            res.should.have.status(200)
            res.body.should.be.a('object')
            res.body.should.have.property('token')
            res.body.should.have.property('expiresIn')
            token = res.body.token
            done()
        })
    })
    it('login with error', function (done) {
        chai.request(server).post('/v1/auth/login')
        .send({
            username: 'dev',
            password: 'dev'
        })
        .end((err, res) => {
            should.not.exist(err)
            res.should.have.status(404)
            done()
        })
    })
    
    it('refresh token with success', function (done) {
        chai.request(server).post('/v1/auth/refresh-token')
        .set("authorization", `Bearer ${token}`)
        .send()
        .end((err, res) => {
            should.not.exist(err)
            res.should.have.status(200)
            res.body.should.be.a('object')
            res.body.should.have.property('token')
            res.body.should.have.property('expiresIn')
            done()
        })
    })
    it('refresh token with error', function (done) {
        chai.request(server).post('/v1/auth/refresh-token')
        .set("authorization", `Bearer invalidToken`)
        .send()
        .end((err, res) => {
            should.not.exist(err)
            res.should.have.status(401)
            done()
        })
    })

})