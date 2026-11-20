import { createError } from "@fastify/error";

export const RequestValidationError = createError(
  "ERR_REQUEST_VALIDATION",
  "Request doesn't match the schema",
  400,
);

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
