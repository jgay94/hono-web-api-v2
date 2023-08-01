import { Context, MiddlewareHandler, Next } from "@deps";

const RESPONSE_HEADER_NAME = "x-test-header";
const RESPONSE_HEADER_VALUE = "true";

export const testHeader: MiddlewareHandler = async (
  ctx: Context,
  next: Next,
) => {
  // Call the next middleware/handler in the chain
  await next();

  // Add 'x-test-header' to the response headers
  ctx.res.headers.set(RESPONSE_HEADER_NAME, RESPONSE_HEADER_VALUE);
};
