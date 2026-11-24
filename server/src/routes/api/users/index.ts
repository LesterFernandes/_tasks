import argon2 from "argon2";
import { type FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { ZUser, type TUser } from "../../../schemas/users.ts";

export default async function (fastify: FastifyInstance) {
  fastify.get(
    "/list",
    {
      onRequest: [fastify.authMiddleware("admin")],
    },
    async function () {
      return await fastify.usersRepository.getAllUsers();
    },
  );

  fastify.post(
    "/create",
    {
      schema: { body: ZUser },
      onRequest: [fastify.authMiddleware("admin")],
    },
    async function (req) {
      try {
        const { email, name, password, role } = req.body as TUser;
        const hash = await argon2.hash(password);
        return await fastify.usersRepository.insertUser({
          email,
          name,
          passwordHash: hash,
          role,
        });
      } catch (error) {
        throw error;
      }
    },
  );

  /**
   * ///
   * added error handler for id not present in db
   * error handlers for drizzle db handling
   */
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
      return await fastify.usersRepository.deleteUser(req.params.id);
    },
  );
}
