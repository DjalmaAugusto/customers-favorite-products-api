const chai = require('chai')
const chaiHttp = require('chai-http')
const should = chai.should()
const expect = chai.expect

const server = require('../src/server')

chai.use(chaiHttp)

describe('Health chech', function () {
    it('check app status', function (done) {
        chai.request(server).get('/v1/health').end((err, res) => {
            should.not.exist(err);
            expect(res).to.have.status(200)
            res.should.have.status(200);
            done();
        })
    });

});