import { eq } from "drizzle-orm";
import { type FastifyInstance } from "fastify";
import fp from "fastify-plugin";
import { usersTable } from "../../../schemas/database/schema.ts";

declare module "fastify" {
  interface FastifyInstance {
    usersRepository: ReturnType<typeof createUsersRepository>;
  }
}

export function createUsersRepository(fastify: FastifyInstance) {
  const { drizzle } = fastify;

  return {
    async getAllUsers() {
      return await drizzle.select().from(usersTable);
    },
    async getUserById(id: string) {
      return await drizzle
        .select()
        .from(usersTable)
        .where(eq(usersTable.id, id));
    },
    async insertUser(name: string, email: string) {
      return await drizzle
        .insert(usersTable)
        .values({
          name,
          email,
        })
        .returning({ insertedId: usersTable.id });
    },
    async deleteUser(id: string) {
      return await drizzle
        .delete(usersTable)
        .where(eq(usersTable.id, id))
        .returning({ deletedId: usersTable.id });
    },
  };
}

export default fp(
  async function (fastify: FastifyInstance) {
    const repo = createUsersRepository(fastify);
    fastify.decorate("usersRepository", repo);
  },
  {
    name: "users-repository",
    dependencies: ["drizzle"],
  },
);
