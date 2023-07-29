import { Context, HTTPException, MiddlewareHandler, Next } from "@hono/mod.ts";

const BAD_REQUEST = "Bad Request"; // 400
const UNAUTHORIZED = "Unauthorized"; // 401
const FORBIDDEN = "Forbidden"; // 403
const NOT_FOUND = "Not Found"; // 404
const INTERNAL_SERVER_ERROR = "Internal Server Error"; // 500

export const errorHandler: MiddlewareHandler = async (
  _ctx: Context,
  next: Next
) => {
  try {
    await next();
  } catch (err) {
    if (err instanceof HTTPException) {
      switch (err.status) {
        case 400:
          return new HTTPException(400, { message: err.message ?? BAD_REQUEST }).getResponse();
        case 401:
          return new HTTPException(401, { message: err.message ?? UNAUTHORIZED }).getResponse();
        case 403:
          return new HTTPException(403, { message: err.message ?? FORBIDDEN }).getResponse();
        case 404:
          return new HTTPException(404, { message: err.message ?? NOT_FOUND }).getResponse();
        default:
          // Handle any other HTTP error statuses
          return new HTTPException(err.status, { message: err.message }).getResponse();
      }
    } else {
      // If it's not an HTTPException, it's likely a server error.
      return new HTTPException(500, { message: err.message ?? INTERNAL_SERVER_ERROR }).getResponse();
    }
  }
};
