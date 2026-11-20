import { eq } from "drizzle-orm";
import type { FastifyInstance } from "fastify";
import {
  projectMembersTable,
  projectsTable,
} from "../../../schemas/database/schema.ts";
import type { TProject } from "../../../schemas/projects.ts";
import fp from "fastify-plugin";

declare module "fastify" {
  interface FastifyInstance {
    projectsRepository: ReturnType<typeof createProjectsRepository>;
  }
}

export function createProjectsRepository(fastify: FastifyInstance) {
  const { drizzle } = fastify;

  return {
    async getAllProjects() {
      return await drizzle.select().from(projectsTable);
    },
    async getProjectById(id: string) {
      return await drizzle
        .select()
        .from(projectsTable)
        .where(eq(projectsTable.id, id));
    },
    async createProject(projectDetails: TProject) {
      return await drizzle.insert(projectsTable).values(projectDetails);
    },
    async deleteProject(projectId: string) {
      return await drizzle
        .delete(projectsTable)
        .where(eq(projectsTable.id, projectId))
        .returning({ deletedId: projectsTable.id });
    },
    async createProjectMember(projectId: string, userId: string) {
      return await drizzle
        .insert(projectMembersTable)
        .values({
          projectId,
          userId,
        })
        .returning();
    },
  };
}

export default fp(
  async function (fastify: FastifyInstance) {
    const repo = createProjectsRepository(fastify);
    fastify.decorate("projectsRepository", repo);
  },
  {
    name: "projects-repository",
    dependencies: ["drizzle"],
  },
);
