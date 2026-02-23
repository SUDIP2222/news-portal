const errorHandler = (err, req, res, next) => {
    let statusCode = err.statusCode || res.statusCode || 500;
    if (statusCode === 200) statusCode = 500;

    let message = err.message || 'Something went wrong. Please try again later.';
    let errorCode = err.errorCode || (statusCode === 500 ? 'INTERNAL_SERVER_ERROR' : 'ERROR');


    if (err.name === 'CastError') {
        statusCode = 400;
        message = 'Invalid request data.';
        errorCode = 'BAD_REQUEST';
    }

    if (err.code === 11000) {
        statusCode = 409;
        message = 'Resource already exists.';
        errorCode = 'CONFLICT';
    }

    let errors = err.errors || undefined;

    if (err.name === 'ValidationError') {
        statusCode = 422;
        message = 'Validation failed.';
        errorCode = 'VALIDATION_ERROR';
        errors = Object.values(err.errors).map(el => el.message);
    }

    if (err.name === 'JsonWebTokenError' || err.name === 'TokenExpiredError') {
        statusCode = 401;
        message = 'Unauthorized access.';
        errorCode = 'UNAUTHORIZED';
    }


    if (statusCode === 500) {
        message = 'Something went wrong. Please try again later.';
        errorCode = 'INTERNAL_SERVER_ERROR';
    }

    const response = {
        success: false,
        message: message,
        errorCode: errorCode,
        statusCode: statusCode
    };

    if (errors) {
        response.errors = errors;
    }

    res.status(statusCode).json(response);
};

const notFound = (req, res, next) => {
    const error = new Error('Resource not found.');
    error.statusCode = 404;
    error.errorCode = 'NOT_FOUND';
    next(error);
};

module.exports = { errorHandler, notFound };