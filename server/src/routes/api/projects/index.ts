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

  fastify.withTypeProvider<ZodTypeProvider>().post(
    "/create",
    {
      schema: { body: ZProject },
      onRequest: [fastify.authMiddleware("admin")],
    },
    async function (req) {
      return await projectsRepository.createProject({
        name: req.body.name,
        description: req.body.description,
        createdBy: req.user.id,
      });
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

  fastify.withTypeProvider<ZodTypeProvider>().get(
    "/details/:projectId",
    {
      schema: {
        params: z.object({
          projectId: z.uuid(),
        }),
      },
    },
    async function (req) {
      return await projectsRepository.getProjectDetails(req.params.projectId);
    },
  );
}
