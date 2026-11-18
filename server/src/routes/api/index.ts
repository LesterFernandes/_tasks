import { type FastifyInstance } from "fastify";

export default async function (fastify: FastifyInstance) {
  fastify.get("/test", function () {
    return "testing rest-api";
  });
}
