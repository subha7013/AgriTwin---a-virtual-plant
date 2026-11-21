import { ApiError } from "../utils/ApiError.js";

export function validate(schema, source = "body") {
  return (req, res, next) => {
    const result = schema.safeParse(req[source]);

    if (!result.success) {
      return next(
        ApiError.badRequest(
          "Validation failed",
          "VALIDATION_ERROR",
          result.error.flatten().fieldErrors
        )
      );
    }

    req[source] = result.data;
    next();
  };
}