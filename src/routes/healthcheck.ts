// deno-lint-ignore-file require-await
import { RouteGroup } from "@lib/mod.ts";
import { testHeader } from "@middleware/mod.ts";

export const healthcheck: RouteGroup = {
  group: {
    prefix: "/healthcheck",
    middleware: [testHeader],
  },
  routes: [
    {
      method: "get",
      path: "/",
      middleware: [],
      handler: async (c) => {
        return c.json({ success: true, message: "I'm alive!" });
      },
    },
  ],
};
