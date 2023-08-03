import { Context, Hono, MiddlewareHandler } from "@deps";

/** Type defining the structure of a route group. */
export type RouteGroup = {
  group: {
    prefix: string;
    middleware: MiddlewareHandler[];
  };
  routes: Route[];
};

/** Type defining the structure of a route. */
type Route = {
  method: HttpMethod;
  path: string;
  middleware: MiddlewareHandler[];
  handler: (c: Context) => Promise<Response> | Promise<void>;
};

/** Enum defining the possible HTTP methods. */
type HttpMethod =
  | "GET"
  | "POST"
  | "PUT"
  | "DELETE"
  | "OPTIONS"
  | "PATCH"
  | "HEAD";

/** Configuration object for the Router class. */
type RouterConfig = {
  router: Hono;
  routeGroups: RouteGroup[];
};

/** Interface that defines the methods for a Router object. */
interface Router {
  createRoutes(): void;
  showRoutes(): void;
}

/**
 * Class that manages the application's routes.
 * @implements {Router}
 */
export class RouterImpl implements Router {
  /** Hono instance that sets up the base API path. */
  private router: Hono;

  /** Array of route groups managed by the router. */
  private routeGroups: RouteGroup[];

  /**
   * @param {RouterConfig} config - Configuration object for the router.
   */
  constructor({ router, routeGroups }: RouterConfig) {
    this.router = router;
    this.routeGroups = routeGroups;
  }

  /** Getter for the router's name. */
  get RouterName(): string {
    return this.router.routerName;
  }

  /** Create routes for the router. */
  public createRoutes(): void {
    this.routeGroups.forEach(({ group, routes }) => {
      routes.forEach(({ method, path, middleware, handler }) => {
        const combinedPath = `${group.prefix}${path}`;
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

  /** Show the routes managed by the router. */
  public showRoutes(): void {
    this.router.showRoutes();
  }
}
