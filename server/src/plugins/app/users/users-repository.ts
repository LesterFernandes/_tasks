import { eq, ne } from "drizzle-orm";
import { type FastifyInstance } from "fastify";
import fp from "fastify-plugin";
import { UserNotFound } from "../../../errors/error-codes.ts";
import { usersTable } from "../../../schemas/database/schema.ts";
import type { TUser } from "../../../schemas/users.ts";

declare module "fastify" {
  interface FastifyInstance {
    usersRepository: ReturnType<typeof createUsersRepository>;
  }
}

export function createUsersRepository(fastify: FastifyInstance) {
  const { drizzle } = fastify;

  return {
    async getAllUsers() {
      return await drizzle
        .select({
          id: usersTable.id,
          email: usersTable.email,
          name: usersTable.name,
          role: usersTable.role,
        })
        .from(usersTable)
        .where(ne(usersTable.role, "admin"));
    },
    async getUserById(id: string) {
      return await drizzle
        .select({
          id: usersTable.id,
          email: usersTable.email,
          name: usersTable.name,
          role: usersTable.role,
        })
        .from(usersTable)
        .where(eq(usersTable.id, id));
    },
    async getUserByEmail(email: string) {
      const userRow = await drizzle
        .select({
          id: usersTable.id,
          email: usersTable.email,
          hash: usersTable.passwordHash,
          role: usersTable.role,
        })
        .from(usersTable)
        .where(eq(usersTable.email, email));
      if (userRow.length == 1) {
        return userRow[0];
      } else {
        throw new UserNotFound();
      }
    },
    async insertUser(
      userDetails: Pick<TUser, "email" | "name" | "role"> & {
        passwordHash: string;
      },
    ) {
      return await drizzle
        .insert(usersTable)
        .values(userDetails)
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
