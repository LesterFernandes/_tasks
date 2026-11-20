import { type FastifyInstance, type FastifyRequest } from "fastify";
import { ZUser, type TUser } from "../../../schemas/users.ts";
import z from "zod";

export default async function (fastify: FastifyInstance) {
  fastify.get("/list", async function () {
    return await fastify.usersRepository.getAllUsers();
  });

  /**
   * ///-
   * improve error handlers, even at global level
   *
   */
  fastify.post(
    "/create",
    {
      schema: { body: ZUser },
    },
    async function (req: FastifyRequest) {
      const { name, email } = req.body as TUser;
      return await fastify.usersRepository.insertUser(name, email);
    },
  );

  /**
   * ///
   * added error handler for id not present in db
   * error handlers for drizzle db handling
   */
  fastify.delete(
    "/:id",
    {
      schema: {
        params: z.object({
          id: z.uuid(),
        }),
      },
    },
    async function (req: FastifyRequest) {
      return await fastify.usersRepository.deleteUser(req.params!.id);
    },
  );
}
