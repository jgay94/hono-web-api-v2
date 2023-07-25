import { Context, Hono, MiddlewareHandler } from "@hono/mod.ts";

export type RouteGroup = {
  group: {
    prefix: string;
    middleware: MiddlewareHandler[];
  };
  routes: Route[];
};

type Route = {
  method: keyof Hono;
  path: string;
  handler: (c: Context) => Promise<Response> | Promise<void>;
  middleware: MiddlewareHandler[];
};

type RouterConfig = {
  app: Hono;
  apiPrefix: string;
  apiRoutes: RouteGroup[];
};

export class Router {
  private app: Hono;
  private apiPrefix: string;
  private apiRoutes: RouteGroup[];

  constructor({ app, apiPrefix, apiRoutes }: RouterConfig) {
    this.app = app;
    this.apiPrefix = apiPrefix;
    this.apiRoutes = apiRoutes;
  }

  get RouterName(): string {
    return this.app.routerName;
  }

  public setupRoutes(): void {
    const routeGroups = this.apiRoutes;
    this.createRoutes(routeGroups);
    this.showRoutes();
    console.log(`Routes created for ${this.RouterName}.`);
  }

  private createRoutes(routeGroups: RouteGroup[]): void {
    routeGroups.forEach(({ group, routes }) => {
      routes.forEach(({ method, path, handler, middleware }) => {
        const combinedPath = `${this.apiPrefix}${group.prefix}${path}`;
        this.app.on(
          method,
          combinedPath,
          ...group.middleware,
          ...middleware,
          handler,
        );
      });
    });
  }

  private showRoutes(): void {
    this.app.showRoutes();
  }
}
