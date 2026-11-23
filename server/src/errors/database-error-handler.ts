import createError, { type FastifyErrorConstructor } from "@fastify/error";
import { DrizzleQueryError } from "drizzle-orm/errors";
import { type FastifyError } from "fastify";

//Data & Constraint Violations (4xx)
export const DbUniqueViolation = createError(
  "ERR_DB_UNIQUE_VIOLATION",
  "Duplicate values violate unique constraint",
  409,
);

export const DbForeignKeyViolation = createError(
  "ERR_DB_FOREIGN_KEY_VIOLATION",
  "Referenced resource does not exist or is still in use",
  400,
);

export const DbNotNullViolation = createError(
  "ERR_DB_NOT_NULL_VIOLATION",
  "Missing required field",
  400,
);

export const DbCheckViolation = createError(
  "ERR_DB_CHECK_VIOLATION",
  "Value fails database check constraint",
  422,
);

export const DbInvalidTextRepresentation = createError(
  "ERR_DB_INVALID_TEXT_REPRESENTATION",
  "Invalid input format for column type",
  400,
);

export const DbStringTruncation = createError(
  "ERR_DB_STRING_TRUNCATION",
  "Input exceeds maximum allowed character length",
  400,
);

// Concurrency & Transaction Errors
export const DbSerializationFailure = createError(
  "ERR_DB_SERIALIZATION_FAILURE",
  "Concurrent transaction conflict, please retry",
  409,
);

export const DbDeadlockDetected = createError(
  "ERR_DB_DEADLOCK_DETECTED",
  "Database deadlock detected, please retry",
  409,
);

export const DbLockNotAvailable = createError(
  "ERR_DB_LOCK_NOT_AVAILABLE",
  "Resource is currently locked, please try again shortly",
  423,
);

// Connection & Infrastructure Errors (5xx)
export const DbTooManyConnections = createError(
  "ERR_DB_TOO_MANY_CONNECTIONS",
  "Database service temporarily unavailable",
  503,
);

export const DbQueryCanceled = createError(
  "ERR_DB_QUERY_CANCELED",
  "Database query timed out",
  504,
);

export const DbUndefinedTable = createError(
  "ERR_DB_UNDEFINED_TABLE",
  "Internal database configuration error",
  500,
);

export const DbInternalError = createError(
  "ERR_DB_INTERNAL_ERROR",
  "An unexpected database error occurred",
  500,
);

const PG_ERROR_MAP: Record<string, FastifyErrorConstructor> = {
  "23505": DbUniqueViolation,
  "23503": DbForeignKeyViolation,
  "23502": DbNotNullViolation,
  "23514": DbCheckViolation,
  "22P02": DbInvalidTextRepresentation,
  "22001": DbStringTruncation,
  "40001": DbSerializationFailure,
  "40P01": DbDeadlockDetected,
  "55P03": DbLockNotAvailable,
  "53300": DbTooManyConnections,
  "57014": DbQueryCanceled,
  "42P01": DbUndefinedTable,
};

export const databaseErrorHandler = (err: FastifyError) => {
  if (err instanceof DrizzleQueryError && err.cause) {
    const pgError = err.cause;
    // @ts-ignore
    const ErrorClass = pgError.code ? PG_ERROR_MAP[pgError.code] : undefined;
    if (ErrorClass) {
      throw new ErrorClass();
    }
  }
};
