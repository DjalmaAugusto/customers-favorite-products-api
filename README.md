## Customer Favorite Product API

API Rest for customers manager your favorite products list

## Software Requirements

-   Node.js **12.3.0+**
-   MongoDB **4.4.1+**
-   Redis   **6.0.9+**

## How to install

### Clone GitHub repo:

```
git clone https://github.com/DjalmaAugusto/customers-favorite-products-api.git
```

### Install Dependencies

```
npm install
```
## How to testing

### Testing API

Reminder: `rename 'env-sample' file to '.env'`

```
npm test
```

## Running API

### Locally

Reminder: `rename 'env-sample' file to '.env'`

```
npm start
```

### Docker
```
docker-compose up
```

## API Docs

Go to [http://localhost:3000/v1/docs](http://localhost:3000/v1/docs) in your browser.

## How to use

* Create a new access user from `/auth/signup` route.
* Generate a JWT Token from `/auth/login` route.
* Use JWT Token in Swagger UI or use the `Authorization: Bearer <yourToken>` header.
* From now, you is able to consume the API

## Project Structure
    .
    ├── logs
    |  ├── access
    |  |  ├── access.log
    |  |  └── accessWithError.log
    |  └── application
    |     └── 2020-10-29.log
    ├── src
    |  ├── app.js
    |  ├── config.js
    |  ├── database
    |  |  ├── cache
    |  |  |  └── redisClient.js
    |  |  ├── connect.js
    |  |  ├── models
    |  |  |  ├── Customer.js
    |  |  |  ├── CustomerProduct.js
    |  |  |  └── User.js
    |  |  └── repositories
    |  |     ├── Customer.js
    |  |     ├── CustomerProduct.js
    |  |     └── User.js
    |  ├── helpers
    |  |  ├── auth.js
    |  |  ├── errorHandler.js
    |  |  ├── logger.js
    |  |  └── requestHandler.js
    |  ├── middleware
    |  |  ├── auth.js
    |  |  └── requestLogger.js
    |  ├── routes
    |  |  └── v1
    |  |     ├── auth
    |  |     |  └── auth.js
    |  |     ├── customer
    |  |     |  ├── customer.js
    |  |     |  ├── customerProduct.js
    |  |     |  └── index.js
    |  |     ├── docs
    |  |     |  └── apiDocs.js
    |  |     └── index.js
    |  ├── server.js
    |  └── services
    |     └── productApi.js
    └── test
    ├── common.js
    ├── index.js
    └── routes
        └── v1
            ├── auth
            |  └── auth.js
            └── customer
                ├── customer.js
                └── customerProduct.js
    ├── docker-compose.yml
    ├── Dockerfile
    ├── package-lock.json
    ├── package.json
    ├── README.md
