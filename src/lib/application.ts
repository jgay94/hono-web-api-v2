import { Hono } from "@hono/mod.ts";
import { timing } from "@hono/middleware/timing/index.ts";
import { logger } from "@hono/middleware/logger/index.ts";

export class Application {
  private app: Hono;

  constructor() {
    this.app = new Hono();
  }

  public bootstrap(): void {
    this.registerAppMiddleware();
    this.setupRoutes();
  }

  public async handler(req: Request): Promise<Response> {
    const response = await this.app.fetch(req);
    return new Response(response.body, response);
  }

  private registerAppMiddleware(): void {
    this.app.use("*", timing());
    this.app.use("*", logger());
  }

  private setupRoutes(): void {
    this.app.get("/", (c) => c.text("Hello world!"));
  }
}
