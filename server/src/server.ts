import cwg from "close-with-grace";
import dotenv from "dotenv";
import fastify from "fastify";
import fp from "fastify-plugin";
import app from "./app.ts";

dotenv.config();

function loggerOptions() {
  /**running in terminal */
  if (process.stdout.isTTY) {
    return {
      level: "info",
      transport: {
        target: "pino-pretty",
        options: {
          translateTime: "HH:MM:ss Z",
          ignore: "pid,hostname",
        },
      },
    };
  }

  return { level: process.env.LOG_LEVEL ?? "silent" };
}

const server = fastify({
  logger: loggerOptions(),
  // recommended timeouts
  connectionTimeout: 120_000,
  requestTimeout: 60_000,
  keepAliveTimeout: 10_000,
  http: {
    headersTimeout: 15_000,
  },
});

async function init() {
  server.register(fp(app));

  cwg({ delay: 500 }, async function ({ err, signal }) {
    if (err) {
      server.log.error({ err }, `server closing with error`);
    } else {
      server.log.info(`${signal} received, server closing`);
    }
    await server.close();
  });

  server.listen(
    { port: Number(process.env.PORT) ?? 3020 },
    function (err: Error | null, address: string) {
      if (err) {
        server.log.error(err);
        process.exit(1);
      } else {
        server.log.info(`app listening on ${address}`);
      }
    },
  );
}

init();
