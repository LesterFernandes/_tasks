import { eq, sql } from "drizzle-orm";
import type { FastifyInstance } from "fastify";
import fp from "fastify-plugin";
import { projectsTable, tasksTable } from "../../../schemas/database/schema.ts";
import type { TTask, TTaskUpdate } from "../../../schemas/tasks.ts";
declare module "fastify" {
  interface FastifyInstance {
    tasksRepository: ReturnType<typeof createTasksRepository>;
  }
}

export function createTasksRepository(fastify: FastifyInstance) {
  const { drizzle } = fastify;
  return {
    async getAllTasks() {
      return await drizzle.select().from(tasksTable);
    },
    async getTasksByProject(projectId: string) {
      return await drizzle
        .select()
        .from(tasksTable)
        .where(eq(tasksTable.projectId, projectId));
    },
    async insertTask(
      task: TTask & {
        createdBy: string;
      },
    ) {
      const { projectId } = task;
      return await drizzle.transaction(async (tx) => {
        // Locking the project row so concurrent inserts for the same project
        // queue up and can't compute the same position
        await tx
          .select({ id: projectsTable.id })
          .from(projectsTable)
          .where(eq(projectsTable.id, projectId))
          .for("update");

        // Next position = current max + 1
        const [{ next }] = await tx
          .select({
            next: sql<number>`coalesce(max(${tasksTable.position}) + 1, 0)`,
          })
          .from(tasksTable)
          .where(eq(tasksTable.projectId, projectId));

        const [insertedTask] = await tx
          .insert(tasksTable)
          .values({
            ...task,
            position: next,
          })
          .returning();

        return insertedTask;
      });
    },
    async deleteTask(id: string) {
      return await drizzle
        .delete(tasksTable)
        .where(eq(tasksTable.id, id))
        .returning({ deletedId: tasksTable.id });
    },
    async updateTask(taskUpdate: TTaskUpdate) {
      return await drizzle
        .update(tasksTable)
        .set(taskUpdate)
        .where(eq(tasksTable.id, taskUpdate.id))
        .returning({ updatedId: tasksTable.id });
    },
  };
}

export default fp(
  async function (fastify: FastifyInstance) {
    const repo = createTasksRepository(fastify);
    fastify.decorate("tasksRepository", repo);
  },
  {
    name: "tasks-repository",
    dependencies: ["drizzle"],
  },
);
