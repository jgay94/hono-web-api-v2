import { Hono } from "@hono/mod.ts";
import { timing } from "@hono/middleware/timing/index.ts";
import { logger } from "@hono/middleware/logger/index.ts";
import { RouteGroup, Router } from "./router.ts";

type AppConfig = {
  apiPrefix: string;
  apiRoutes: RouteGroup[];
};

export class Application {
  private app: Hono;
  private router: Router;

  constructor({ apiPrefix, apiRoutes }: AppConfig) {
    this.app = new Hono();
    this.router = new Router({ app: this.app, apiPrefix, apiRoutes });
  }

  public async handler(req: Request): Promise<Response> {
    const response = await this.app.fetch(req);
    return new Response(response.body, response);
  }

  public bootstrap(): void {
    this.registerAppMiddleware();
    this.router.setupRoutes();
  }

  private registerAppMiddleware(): void {
    this.app.use("*", timing());
    this.app.use("*", logger());
  }
}
