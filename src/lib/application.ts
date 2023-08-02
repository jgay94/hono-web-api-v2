import { Hono } from "@deps";
import { errorHandler, logger, timing } from "@middleware";
import { RouteGroup, Router } from "@lib";

type AppConfig = {
  apiPrefix: string;
  apiRoutes: RouteGroup[];
};

interface Application {
  handler(req: Request): Promise<Response>;
  bootstrap(): void;
}

export class ApplicationImpl implements Application {
  private app: Hono;
  private router: Router;
  private apiRoutes: RouteGroup[];

  constructor({ apiPrefix, apiRoutes }: AppConfig) {
    this.app = new Hono();
    this.router = new Router({ router: this.app, apiPrefix });
    this.apiRoutes = apiRoutes;
  }

  public async handler(req: Request): Promise<Response> {
    const response = await this.app.fetch(req);
    return new Response(response.body, response);
  }

  public bootstrap(): void {
    this.registerMiddleware();
    this.setupRoutes();
    console.log("Application bootstrapped.");
  }

  private registerMiddleware(): void {
    this.app.use("*", errorHandler);
    this.app.use("*", timing());
    this.app.use("*", logger());
    console.log("Middleware registered.");
  }

  private setupRoutes(): void {
    this.router.createRoutes(this.apiRoutes);
    // this.router.showRoutes();
    console.log(`Routes set up for ${this.router.RouterName}.`);
  }
}
