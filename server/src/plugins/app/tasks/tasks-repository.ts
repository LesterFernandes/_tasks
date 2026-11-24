import { eq } from "drizzle-orm";
import type { FastifyInstance } from "fastify";
import { tasksTable } from "../../../schemas/database/schema.ts";
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
    async insertTask(task: TTask) {
      return await drizzle
        .insert(tasksTable)
        .values(task)
        .returning({ insertedId: tasksTable.id });
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
