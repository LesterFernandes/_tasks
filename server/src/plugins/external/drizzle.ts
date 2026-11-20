import dotenv from "dotenv";
import { drizzle as drizzle_lib } from "drizzle-orm/node-postgres";
import type { FastifyInstance } from "fastify";
import fp from "fastify-plugin";
import { Pool } from "pg";

dotenv.config();
const pool = new Pool({
  connectionString: process.env.DB_URL!,
});
const drizzle = drizzle_lib({ client: pool });

declare module "fastify" {
  export interface FastifyInstance {
    drizzle: typeof drizzle;
  }
}

export default fp(
  async function drizzlePlugin(fastify: FastifyInstance) {
    fastify.decorate("drizzle", drizzle);

    fastify.addHook("onClose", async () => {
      await drizzle.$client.end();
    });
  },
  { name: "drizzle" },
);
