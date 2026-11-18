import fastify from "fastify";
import cwg from "close-with-grace";
import dotenv from "dotenv";

dotenv.config();

const server = fastify({
  logger: {
    transport: {
      target: "@fastify/one-line-logger",
    },
  },
});

server.get("/test", function () {
  return "test successfull";
});

server.listen(
  { port: Number(process.env.PORT) },
  function (err: Error | null, address: string) {
    if (err) {
      server.log.error(err);
    } else {
      server.log.info(`app listening on ${address}`);
    }
  },
);

cwg({ delay: 500 }, async function ({ err, signal }) {
  if (err) {
    server.log.error({ err }, `server closing with error`);
  } else {
    server.log.info(`${signal} received, server closing`);
  }
  server.close();
});
