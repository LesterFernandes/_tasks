import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { ZTask, ZTaskUpdate } from "../../../schemas/tasks.ts";

export default async function (fastify: FastifyInstance) {
  fastify.get(
    "/list",
    {
      onRequest: [fastify.authMiddleware("admin", "user")],
    },
    async function () {
      return await fastify.tasksRepository.getAllTasks();
    },
  );

  fastify.withTypeProvider<ZodTypeProvider>().get(
    "/:projectId",
    {
      schema: {
        params: z.object({
          projectId: z.uuid(),
        }),
      },
      onRequest: [fastify.authMiddleware("admin", "user")],
    },
    async function (req) {
      return await fastify.tasksRepository.getTasksByProject(
        req.params.projectId,
      );
    },
  );

  fastify.withTypeProvider<ZodTypeProvider>().post(
    "/create",
    {
      schema: { body: ZTask },
      onRequest: [fastify.authMiddleware("admin", "user")],
    },
    async function (req) {
      return await fastify.tasksRepository.insertTask(req.body);
    },
  );

  fastify.withTypeProvider<ZodTypeProvider>().delete(
    "/:id",
    {
      schema: {
        params: z.object({
          id: z.uuid(),
        }),
      },

      onRequest: [fastify.authMiddleware("admin", "user")],
    },
    async function (req) {
      return await fastify.tasksRepository.deleteTask(req.params.id);
    },
  );

  fastify.withTypeProvider<ZodTypeProvider>().post(
    "/update",
    {
      schema: { body: ZTaskUpdate },
      onRequest: [fastify.authMiddleware("admin", "user")],
    },
    async function (req) {
      return await fastify.tasksRepository.updateTask(req.body);
    },
  );
}
