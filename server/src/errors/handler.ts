import {
  type FastifyError,
  type FastifyInstance,
  type FastifyReply,
  type FastifyRequest,
} from "fastify";
import {
  hasZodFastifySchemaValidationErrors,
  isResponseSerializationError,
} from "fastify-type-provider-zod";
import {
  RequestValidationError,
  ResponseSerializationError,
} from "./error-codes.ts";
import { databaseErrorHandler } from "./database-error-handler.ts";

export default (fastify: FastifyInstance) => {
  return (err: FastifyError, request: FastifyRequest, reply: FastifyReply) => {
    fastify.log.error({
      err,
      request: {
        method: request.method,
        url: request.url,
        query: request.query,
        params: request.params,
        body: request.body,
      },
    });

    databaseErrorHandler(err);

    if (hasZodFastifySchemaValidationErrors(err)) {
      throw new RequestValidationError();
    }

    if (isResponseSerializationError(err)) {
      throw new ResponseSerializationError();
    }

    reply.code(err.statusCode ?? 500);

    let message = "Internal Server Error";
    if (err.statusCode && err.statusCode < 500) {
      message = err.message;
    }

    return { message };
  };
};
