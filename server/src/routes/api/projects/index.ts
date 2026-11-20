import type { FastifyInstance, FastifyRequest } from "fastify";
import { ZProject, type TProject } from "../../../schemas/projects.ts";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";

export default async function (fastify: FastifyInstance) {
  const { projectsRepository } = fastify;

  fastify.get("/list", async function () {
    return await fastify.projectsRepository.getAllProjects();
  });

  fastify.post(
    "/create",
    { schema: { body: ZProject } },
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
    },
    async function (req) {
      const { projectId, userId } = req.body;
      projectsRepository.createProjectMember(projectId, userId);
    },
  );
}
