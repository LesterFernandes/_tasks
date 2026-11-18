import path from "node:path";
import fastifyAutoload from "@fastify/autoload";
import {
  type FastifyError,
  type FastifyInstance,
  type FastifyPluginOptions,
  type FastifyRequest,
  type FastifyReply,
} from "fastify";

export default async function App(
  fastify: FastifyInstance,
  opts: FastifyPluginOptions,
) {
  // register routes & services
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
