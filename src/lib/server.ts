import { Application, RouteGroup } from "@lib/mod.ts";

type ServerConfig = {
  app: {
    port: number;
    hostname: string;
    apiPrefix: string;
  };
  apiRoutes: RouteGroup[];
};

interface Server {
  start(): void;
  stop(reason?: DOMException): void;
}

export class ServerImpl implements Server {
  /** Configuration object that sets up the server environment. */
  private config: ServerConfig;

  /** Application instance that encapsulates route and middleware configurations. */
  private app: Application;

  /** AbortController instance used to signal when the server should stop. */
  private controller: AbortController;

  constructor(config: ServerConfig) {
    this.config = config;
    this.app = new Application({
      apiPrefix: this.config.app.apiPrefix,
      apiRoutes: this.config.apiRoutes,
    });
    this.controller = new AbortController();
  }

  public start(): void {
    this.app.bootstrap();
    this.serve();
  }

  public stop(reason?: DOMException): void {
    this.controller.abort(reason);
    console.log("Server stopped.");
    if (reason) {
      console.error(reason);
    }
  }

  private serve(): void {
    const port = this.config.app.port;
    const hostname = this.config.app.hostname;
    const signal = this.controller.signal;
    Deno.serve({ port, hostname, signal }, this.app.handler.bind(this.app));
  }
}
