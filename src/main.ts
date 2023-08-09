import { Server } from "@lib";
import { config, log } from "@utils";
import { healthcheck } from "@routes";

const server = new Server({
  env: {
    name: config.env.name,
    logLevel: config.env.logLevel,
  },
  server: {
    port: config.server.port,
    hostname: config.server.hostname,
  },
  db: {
    user: config.db.user,
    database: config.db.database,
    hostname: config.db.hostname,
    port: config.db.port,
    password: config.db.password,
  },
  app: {
    apiPrefix: "/api/v1",
    apiRoutes: [healthcheck],
  },
});

if (import.meta.main) {
  try {
    await server.start();
  } catch (error) {
    log.error(`Server failed to start: ${error}`);
  }
} else {
  log.warning("This module is not meant to be imported.");
}
