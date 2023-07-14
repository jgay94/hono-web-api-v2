import { Hono, MiddlewareHandler } from "@hono/mod.ts";
// import { Router as HonoRouter } from "@hono/router.ts";

type Route = {
  method:
    | "all"
    | "delete"
    | "get"
    | "head"
    | "options"
    | "patch"
    | "post"
    | "put";
  path: string;
  middleware: MiddlewareHandler[];
  // handler: (ctx: RouterContext<string>) => Promise<void> | void;
};

export type RouteGroup = {
  prefix: string;
  routes: Route[];
};

export class Router {
  // private router: HonoRouter<string>;

  constructor(apiPrefix: string) {
    this.router = new Hono().basePath(apiPrefix);
  }

  public registerTo(app: Hono): void {
    app.route("/", this.router);
  }

  public registerRoutes(routeGroups: RouteGroup[]): void {
    this.generateRoutes(routeGroups);
  }

  private generateRoutes(routeGroups: RouteGroup[]): void {
    routeGroups.forEach(({ prefix, routes }) => {
      const group = new Hono();
      routes.forEach(({ method, path, handler }) => {
        if (Array.isArray(method)) {
          method.forEach((m) => group.on(m, path, handler));
        } else {
          (group[method] as any)(path, handler);
        }
      });
      this.router.route(prefix, group);
    });
  }
}
