class ApiError extends Error {
    statusCode = 500;
    message = 'Something went wrong';

    constructor(statusCode, message) {
        super();
        this.statusCode = statusCode;
        this.message = message;
    }
}

module.exports = ApiError;
