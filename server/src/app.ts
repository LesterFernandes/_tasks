import fastifyAutoload from "@fastify/autoload";
import {
  type FastifyError,
  type FastifyInstance,
  type FastifyPluginOptions,
  type FastifyReply,
  type FastifyRequest,
} from "fastify";
import path from "node:path";
import {
  hasZodFastifySchemaValidationErrors,
  isResponseSerializationError,
  serializerCompiler,
  validatorCompiler,
} from "fastify-type-provider-zod";

export default async function App(
  fastify: FastifyInstance,
  opts: FastifyPluginOptions,
) {
  // Add schema validator and serializer
  fastify.setValidatorCompiler(validatorCompiler);
  fastify.setSerializerCompiler(serializerCompiler);

  fastify.register(fastifyAutoload, {
    dir: path.join(import.meta.dirname, "plugins/external"),
    options: { ...opts },
    autoHooks: true,
    cascadeHooks: true,
  });

  fastify.register(fastifyAutoload, {
    dir: path.join(import.meta.dirname, "plugins/app"),
    options: { ...opts },
  });

  fastify.register(fastifyAutoload, {
    dir: path.join(import.meta.dirname, "routes"),
    options: { ...opts },
    // autoHooks: true,
    // cascadeHooks: true,
  });

  // configuring error handler
  fastify.setErrorHandler(
    (err: FastifyError, request: FastifyRequest, reply: FastifyReply) => {
      fastify.log.error(
        {
          err,
          request: {
            method: request.method,
            url: request.url,
            query: request.query,
            params: request.params,
          },
        },
        "Unhandled error occurred",
      );

      if (hasZodFastifySchemaValidationErrors(err)) {
        return reply.code(400).send({
          error: "Response Validation Error",
          message: "Request doesn't match the schema",
          statusCode: 400,
          details: {
            issues: err.validation,
            method: request.method,
            url: request.url,
          },
        });
      }

      if (isResponseSerializationError(err)) {
        return reply.code(500).send({
          error: "Internal Server Error",
          message: "Response doesn't match the schema",
          statusCode: 500,
          details: {
            issues: err.cause.issues,
            method: err.method,
            url: err.url,
          },
        });
      }

      reply.code(err.statusCode ?? 500);

      let message = "Internal Server Error";
      if (err.statusCode && err.statusCode < 500) {
        message = err.message;
      }

      return { message };
    },
  );

  // 404 error handling
  fastify.setNotFoundHandler((request: FastifyRequest, reply: FastifyReply) => {
    request.log.warn(
      {
        request: {
          method: request.method,
          url: request.url,
          query: request.query,
          params: request.params,
        },
      },
      "Resource not found",
    );

    reply.code(404);

    return { message: "Not Found" };
  });
}
