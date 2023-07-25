import { Server } from "@lib/mod.ts";
import { healthcheck } from "@routes/mod.ts";

const server = new Server({
  app: {
    port: 8080,
    apiPrefix: "/api/v1",
  },
  apiRoutes: [healthcheck],
})

if (import.meta.main) {
  server.start();
} else {
  console.warn("This module is not meant to be imported.");
}
