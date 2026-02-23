class AppError extends Error {
    constructor(message, statusCode, errorCode = null, errors = null) {
        super(message);
        this.statusCode = statusCode;
        this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
        this.errorCode = errorCode || this.getDefaultErrorCode(statusCode);
        this.errors = errors;
        this.isOperational = true;

        Error.captureStackTrace(this, this.constructor);
    }

    getDefaultErrorCode(statusCode) {
        switch (statusCode) {
            case 400: return 'BAD_REQUEST';
            case 401: return 'UNAUTHORIZED';
            case 403: return 'FORBIDDEN';
            case 404: return 'NOT_FOUND';
            case 409: return 'CONFLICT';
            case 422: return 'VALIDATION_ERROR';
            case 500: return 'INTERNAL_SERVER_ERROR';
            default: return 'ERROR';
        }
    }
}

module.exports = AppError;
