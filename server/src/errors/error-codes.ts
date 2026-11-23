import { createError } from "@fastify/error";

export const RequestValidationError = createError(
  "ERR_REQUEST_VALIDATION",
  "Request doesn't match the schema",
  400,
);

export const BadRequest = createError("ERR_BAD_REQUEST", "Bad Request", 400);

export const UserNotFound = createError(
  "ERR_USER_NOT_FOUND",
  "Bad Request",
  400,
);

export const Unauthorized = createError(
  "ERR_UNAUTHORIZED",
  "User is not authorized",
  401,
);

export const Forbidden = createError("ERR_FORBIDDEN", "Forbidden", 403);

export const InternalServerError = createError(
  "ERR_INTERNAL_SERVER",
  "Internal Server Error",
  500,
);

export const ResponseSerializationError = createError(
  "ERR_SERIALIZATION",
  "Response doesn't match the schema",
  500,
);
