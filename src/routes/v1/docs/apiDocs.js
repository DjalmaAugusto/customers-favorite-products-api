const swaggerJsDoc = require("swagger-jsdoc")
const swaggerUi = require("swagger-ui-express")

const express = require("express")
const router = express.Router()

const swaggerOptions = {
  definition: {
    openapi: "3.0.0",
    info: {
      version: "1.0.0",
      title: "Customer's Favorite Products API",
      description: "API for Customers manager your favorite Products",
      contact: {
        name: "Djalma Freitas"
      },
      license: {
        name: "Apache 2.0",
        url: "https://www.apache.org/licenses/LICENSE-2.0.html"
      }
    },
    servers: [{
      url: "http://localhost:3000/v1/",
      description: "Development server"
    }],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT"
        }
      },
      schemas: {
        meta: {
          type: "object",
          required: [
            "page",
            "page_size"
          ],
          properties: {
            page: {
              type: "integer",
              description: "The page provided"
            },
            page_size: {
              type: "integer",
              description: "The page size"
            }
          }
        },
        customer: {
          type: "object",
          required: [
            "name",
            "email"
          ],
          properties: {
            name: {
              type: "string",
              description: "The email of customer"
            },
            email: {
              type: "string",
              description: "The name of customer"
            }
          }
        },
        customerProduct: {
          type: "object",
          required: [
            "productId"
          ],
          properties: {
            productId: {
              type: "string",
              description: "The id of product"
            }
          }
        },
        product: {
          type: "object",
          required: [
            "id",
            "title",
            "price",
            "image"
          ],
          properties: {
            id: {
              type: "string",
              description: "The id of product"
            },
            title: {
              type: "string",
              description: "The title of product"
            },
            price: {
              type: "number",
              description: "The price of product"
            },
            image: {
              type: "string",
              description: "The image of product"
            },
            reviewScore: {
              type: "number",
              description: "The review score of product"
            }
          }
        },
        user: {
          type: "object",
          required: [
            "username",
            "password"
          ],
          properties: {
            username: {
              type: "string",
              description: "The username of user"
            },
            password: {
              type: "string",
              description: "The password of user"
            }
          }
        },
        token: {
          type: "object",
          required: [
            "token",
            "expiresIn"
          ],
          properties: {
            token: {
              type: "string",
              description: "The bearer token"
            },
            expiresIn: {
              type: "integer",
              description: "The expires in"
            }
          }
        },
        error: {
          type: "object",
          required: [
            "code",
            "type",
            "message"
          ],
          properties: {
            code: {
              type: "integer",
              description: "The code of error"
            },
            type: {
              type: "string",
              description: "The type of error"
            },
            message: {
              type: "string",
              description: "The message of error"
            }
          }
        }
      }
    }
  },
  apis: ["./src/routes/v1/**/*.js"]
};

const swaggerDocs = swaggerJsDoc(swaggerOptions)
router.use("/", swaggerUi.serve, swaggerUi.setup(swaggerDocs, { explorer: true }))

module.exports = router

