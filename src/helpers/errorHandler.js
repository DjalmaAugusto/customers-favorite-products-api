class NotFoundResource extends Error {
    constructor(message, httpCode=404) {
        super(message);
        this.httpCode = httpCode
        this.type = "not_found"
    }
}

class DuplicateResource extends Error {
    constructor(message, httpCode=409) {
        super(message);
        this.httpCode = httpCode
        this.type = "duplicate"
    }
}

class InvalidFormat extends Error {
    constructor(message, httpCode=412) {
        super(message);
        this.httpCode = httpCode
        this.type = "invalid_format"
    }
}

class BadRequest extends Error {
    constructor(message, httpCode=400) {
        super(message);
        this.httpCode = httpCode        
        this.type = "bad_request"
    }
}

class Unauthorized extends Error {
    constructor(message, httpCode=401) {
        super(message);
        this.httpCode = httpCode        
        this.type = "unauthorized"
    }
}

class Forbidden extends Error {
    constructor(message, httpCode=403) {
        super(message);
        this.httpCode = httpCode        
        this.type = "forbidden"
    }
}

class InternalServerError extends Error {
    constructor(message, httpCode=500) {
        super(message);
        this.httpCode = httpCode        
        this.type = "bad_request"
    }
}

const serializeError = err => {
    return {
        code: err.httpCode,
        type: err.type,
        message: err.message
    }
}

module.exports = {
    NotFoundResource,
    BadRequest,
    DuplicateResource,
    InternalServerError,
    Unauthorized,
    Forbidden,
    serializeError
}