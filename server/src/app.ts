import fastifyAutoload from "@fastify/autoload";
import {
  type FastifyInstance,
  type FastifyPluginOptions,
  type FastifyReply,
  type FastifyRequest,
} from "fastify";
import {
  serializerCompiler,
  validatorCompiler,
} from "fastify-type-provider-zod";
import path from "node:path";
import errorHandler from "./errors/handler.ts";

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
  fastify.setErrorHandler(errorHandler(fastify));

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
