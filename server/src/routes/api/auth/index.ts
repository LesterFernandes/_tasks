import argon2 from "argon2";
import type { FastifyInstance } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import z from "zod";
import { Unauthorized } from "../../../errors/error-codes.ts";

const cookieOptions = {
  path: "/",
  httpOnly: true, // Prevents XSS attacks from reading the token
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
};

export default async function (fastify: FastifyInstance) {
  fastify.withTypeProvider<ZodTypeProvider>().post(
    "/sign-in",
    {
      schema: {
        body: z.object({
          email: z.string(),
          password: z.string(),
        }),
      },
    },
    async function (req, reply) {
      const userRow = await fastify.usersRepository.getUserByEmail(
        req.body.email,
      );
      try {
        const verified = await argon2.verify(userRow!.hash, req.body.password);
        if (!verified) {
          throw new Unauthorized();
        }
        // @ts-ignore
        delete userRow!.hash;
        const token = fastify.jwt.sign(userRow!, {
          expiresIn: "1d",
        });
        reply.setCookie("token", token, cookieOptions).send({ success: true });
      } catch (error) {
        throw error;
      }
    },
  );

  fastify.post("/sign-out", function (req, reply) {
    reply
      .clearCookie("token", cookieOptions)
      .status(200)
      .send("user successfully signed out");
  });
}
