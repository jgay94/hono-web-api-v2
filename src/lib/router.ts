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
  middleware: MiddlewareHandler[];
  handler: (c: Context) => Promise<Response> | Promise<void>;
};

type RouterConfig = {
  router: Hono;
  apiPrefix: string;
};

interface Router {
  createRoutes(routeGroups: RouteGroup[]): void;
  showRoutes(): void;
}

export class RouterImpl implements Router {
  private router: Hono;
  private apiPrefix: string;

  constructor({ router, apiPrefix }: RouterConfig) {
    this.router = router;
    this.apiPrefix = apiPrefix;
  }

  get RouterName(): string {
    return this.router.routerName;
  }

  public createRoutes(routeGroups: RouteGroup[]): void {
    routeGroups.forEach(({ group, routes }) => {
      routes.forEach(({ method, path, middleware, handler }) => {
        const combinedPath = `${this.apiPrefix}${group.prefix}${path}`;
        this.router.on(
          method,
          combinedPath,
          ...group.middleware,
          ...middleware,
          handler,
        );
      });
    });
  }

  public showRoutes(): void {
    this.router.showRoutes();
  }
}
