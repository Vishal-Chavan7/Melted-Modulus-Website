import ApiError from '../utils/ApiError.js'

const errorHandler = (err, req, res, next) => {
    
    // Initialize with defaults
    let statusCode = err.statusCode || 500;
    let message = err.message || "Internal server error";
    let errors = err.errors || [];

    if (err.code === 11000) {
        statusCode = 409;
        message = "Resource already exists";
        errors = Object.keys(err.keyValue || {}).map((field) => ({
            field,
            message: `${field} already exists`
        }));
    }
    else if (err.name === "ValidationError") {
        statusCode = 400;
        message = "Validation failed";
        errors = Object.values(err.errors).map((error) => ({
            field: error.path,
            message: error.message
        }));
    }
    else if (err.name === "CastError") {
        statusCode = 400;
        message = "Invalid resource id";
        errors = [{
            field: err.path,
            message: err.message
        }];
    }
    // Fallback for unexpected errors
    else if (!(err instanceof ApiError)) {
        statusCode = 500;
        message = "Something went wrong on the server";
        errors = [];
    }

    // Build response object
    const response = {
        statusCode,
        success: false,
        message,
        errors,
        // Only expose stack trace in development
        ...(process.env.NODE_ENV === "development" && { stack: err.stack })
    };

    // Send response to client
    res.status(statusCode).json(response);
};

export default errorHandler;