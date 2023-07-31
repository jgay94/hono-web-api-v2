// deno-lint-ignore-file require-await
import { RouteGroup } from "@lib/mod.ts";
import { testHeader } from "@middleware/mod.ts";
import { HTTPException } from "@hono/mod.ts";

export const healthcheck: RouteGroup = {
  group: {
    prefix: "/healthcheck",
    middleware: [testHeader],
  },
  routes: [
    {
      method: "GET",
      path: "/",
      middleware: [],
      handler: async (c) => {
        return c.json({ success: true, message: "I'm alive!" });
      },
    },
    {
      method: "GET",
      path: "/throw",
      middleware: [],
      handler: async (_c) => {
        throw new HTTPException(500, { message: "This is a test error" });
      },
    },
  ],
};
