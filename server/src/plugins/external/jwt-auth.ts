import fastifyCookie from "@fastify/cookie";
import jwt from "@fastify/jwt";
import dotenv from "dotenv";
import {
  type FastifyInstance,
  type FastifyReply,
  type FastifyRequest,
} from "fastify";
import fp from "fastify-plugin";
import { Forbidden, Unauthorized } from "../../errors/error-codes.ts";

dotenv.config();

type Role = "admin" | "user";
type AuthPayload = {
  id: string;
  email: string;
  role: Role;
};

declare module "@fastify/jwt" {
  interface FastifyJWT {
    payload: AuthPayload;
    user: AuthPayload;
  }
}

declare module "fastify" {
  interface FastifyInstance {
    authMiddleware: (
      ...roles: Role[]
    ) => (
      req: FastifyRequest,
      reply: FastifyReply,
    ) => Promise<FastifyReply | void>;
  }
}

export default fp(
  async function (fastify: FastifyInstance) {
    fastify.register(fastifyCookie);
    fastify.register(jwt, {
      secret: process.env.JWT_SECRET!,
      cookie: {
        cookieName: "token",
        signed: false,
      },
    });

    fastify.decorate("authMiddleware", (...roles: Role[]) => {
      return async (request: FastifyRequest, reply: FastifyReply) => {
        try {
          await request.jwtVerify();
        } catch {
          throw new Unauthorized();
        }
        if (!roles.includes(request.user.role)) {
          throw new Forbidden();
        }
      };
    });
  },
  { name: "authMiddleware" },
);
