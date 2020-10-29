
const chai = require('chai')
const chaiHttp = require('chai-http')
const faker = require('faker')

const User = require("../src/database/repositories/User")
const Customer = require("../src/database/repositories/Customer")
const TEST_USER = {
    username: faker.internet.userName(),
    password: faker.internet.password()
}
const TEST_CUSTOMER = {
    email: faker.internet.email(),
    name: faker.name.firstName()
}
const TEST_CUSTOMER_PRODUCT = {
    productId: "2e51a272-7024-f4cc-52d4-67d00c6dd5e2"
}

const { login } = require('../src/helpers/auth')
chai.use(chaiHttp)
 
const createTestUser = async () => {
    await User.create({ user: TEST_USER })
}
 
const getTestUser = async () => {
    const user = await User.findOne({ username: TEST_USER.username });
    if (!user) {
        await createTestUser()
        return await getTestUser()
    } else {
        return user
    }
}
 
const loginWithTestUser = async () => {
    const user = await getTestUser()
    return await login(user)
}
 
const cleanTestUser = async () => {
    await User.remove({ username: TEST_USER.username })
}

const createTestCustomer = async () => {
    await Customer.create({ customer: TEST_CUSTOMER })
}

const cleanTestCustomer = async () => {
    await Customer.remove({ email: TEST_CUSTOMER.email })
}

module.exports = {
    TEST_USER,    
    getTestUser,
    loginWithTestUser,
    cleanTestUser,
    TEST_CUSTOMER,
    createTestCustomer,
    cleanTestCustomer,
    TEST_CUSTOMER_PRODUCT
}