import { and, desc, eq } from "drizzle-orm";
import { alias } from "drizzle-orm/pg-core";
import type { FastifyInstance } from "fastify";
import fp from "fastify-plugin";
import {
  projectMembersTable,
  projectsTable,
  tasksTable,
  usersTable,
} from "../../../schemas/database/schema.ts";
import type { TProject } from "../../../schemas/projects.ts";
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
    async getProjectsAssociatedWithUser(userId: string) {
      return await drizzle
        .select({
          id: projectsTable.id,
          name: projectsTable.name,
          description: projectsTable.description,
          createdBy: projectsTable.createdBy,
        })
        .from(projectMembersTable)
        .innerJoin(
          projectsTable,
          eq(projectMembersTable.projectId, projectsTable.id),
        )
        .where(eq(projectMembersTable.userId, userId));
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
    async getProjectDetails(projectId: string) {
      const creator = alias(usersTable, "creator");
      const assignee = alias(usersTable, "assignee");

      const [[project], users, tasks] = await Promise.all([
        // project + creator
        drizzle
          .select({
            id: projectsTable.id,
            name: projectsTable.name,
            description: projectsTable.description,
            createdAt: projectsTable.createdAt,
            updatedAt: projectsTable.updatedAt,
            creator: {
              id: creator.id,
              name: creator.name,
              email: creator.email,
            },
          })
          .from(projectsTable)
          .innerJoin(creator, eq(projectsTable.createdBy, creator.id))
          .where(eq(projectsTable.id, projectId))
          .limit(1),

        // users in the project, role "user" only
        drizzle
          .select({
            id: usersTable.id,
            name: usersTable.name,
            email: usersTable.email,
            role: usersTable.role,
            joinedAt: projectMembersTable.joinedAt,
          })
          .from(projectMembersTable)
          .innerJoin(usersTable, eq(projectMembersTable.userId, usersTable.id))
          .where(
            and(
              eq(projectMembersTable.projectId, projectId),
              eq(usersTable.role, "user"),
            ),
          ),

        // tasks + assignee (left join, since assignedTo is nullable)
        drizzle
          .select({
            id: tasksTable.id,
            name: tasksTable.name,
            description: tasksTable.description,
            status: tasksTable.status,
            createdAt: tasksTable.createdAt,
            assignee: {
              id: assignee.id,
              name: assignee.name,
              email: assignee.email,
            },
          })
          .from(tasksTable)
          .leftJoin(assignee, eq(tasksTable.assignedTo, assignee.id))
          .where(eq(tasksTable.projectId, projectId))
          .orderBy(desc(tasksTable.createdAt)),
      ]);

      if (!project) return null;

      return { ...project, users, tasks };
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
