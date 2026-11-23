import type { FastifyInstance, FastifyRequest } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { ZProject, type TProject } from "../../../schemas/projects.ts";

export default async function (fastify: FastifyInstance) {
  const { projectsRepository } = fastify;

  fastify.get(
    "/list",
    {
      onRequest: [fastify.authMiddleware("admin")],
    },
    async function () {
      return await fastify.projectsRepository.getAllProjects();
    },
  );

  fastify.post(
    "/create",
    {
      schema: { body: ZProject },
      onRequest: [fastify.authMiddleware("admin")],
    },
    async function (req: FastifyRequest) {
      return await projectsRepository.createProject(req.body as TProject);
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
      onRequest: [fastify.authMiddleware("admin")],
    },
    async function (req) {
      return await projectsRepository.deleteProject(req.params.id);
    },
  );

  fastify.withTypeProvider<ZodTypeProvider>().post(
    "/create-member",
    {
      schema: {
        body: z.object({
          projectId: z.uuid(),
          userId: z.uuid(),
        }),
      },
      onRequest: [fastify.authMiddleware("admin")],
    },
    async function (req) {
      const { projectId, userId } = req.body;
      return await projectsRepository.createProjectMember(projectId, userId);
    },
  );
}
