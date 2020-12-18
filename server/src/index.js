import logger from "./logger";
import app from "./app";

async function main() {
  await app.get("knex").migrate.latest();

  const port = app.get("port");
  const server = app.listen(port);

  process.on("unhandledRejection", (reason, p) =>
    logger.error("Unhandled Rejection at: Promise ", p, reason)
  );

  server.on("listening", () => {
    logger.info(
      "Feathers application started on http://%s:%d",
      app.get("host"),
      port
    );
  });
}

main().catch((error) => {
  logger.error("Application error: ", error);
});
