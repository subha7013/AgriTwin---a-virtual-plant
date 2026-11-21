import { ApiError } from "../utils/ApiError.js";
import { logger } from "../config/logger.js";

export function notFound(req, res, next) {
  next(ApiError.notFound(`Route not found: ${req.method} ${req.originalUrl}`));
}

export function errorHandler(error, req, res, next) {
  if (res.headersSent) {
    return next(error);
  }

  let statusCode = error.statusCode || 500;
  let code = error.code || "INTERNAL_ERROR";
  let message = error.message || "Internal server error";
  let details = error.details || null;

  if (error.name === "JsonWebTokenError") {
    statusCode = 401;
    code = "INVALID_TOKEN";
    message = "Invalid authentication token";
  }

  if (error.name === "TokenExpiredError") {
    statusCode = 401;
    code = "TOKEN_EXPIRED";
    message = "Authentication token expired";
  }

  if (error.name === "ValidationError" && error.errors) {
    statusCode = 400;
    code = "VALIDATION_ERROR";
    message = "Database validation failed";
    details = Object.fromEntries(
      Object.entries(error.errors).map(([field, value]) => [field, value.message])
    );
  }

  if (error.name === "CastError") {
    statusCode = 400;
    code = "INVALID_ID";
    message = `Invalid ${error.path}: ${error.value}`;
  }

  if (error.code === 11000) {
    statusCode = 409;
    code = "DUPLICATE_KEY";
    const fields = Object.keys(error.keyValue || {});
    message = fields.length
      ? `${fields.join(", ")} already exists`
      : "Resource already exists";
  }

  if (statusCode >= 500) {
    logger.error(`${req.method} ${req.originalUrl} failed`, error.stack);
  }

  res.status(statusCode).json({
    success: false,
    error: { code, message, details },
  });
}