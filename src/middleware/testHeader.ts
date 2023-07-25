import { MiddlewareHandler } from "@hono/mod.ts";

export const testHeader: MiddlewareHandler = async (ctx, next) => {
  // Call the next middleware/handler in the chain
  await next();

  // Add 'x-test-header' to the response headers
  ctx.res.headers.set("x-test-header", "true");
};
