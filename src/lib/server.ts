import { Application, RouteGroup } from "@lib/mod.ts";

type ServerConfig = {
  app: {
    port: number;
    apiPrefix: string;
  };
  apiRoutes: RouteGroup[];
};

export class Server {
  private config: ServerConfig;
  private app: Application;
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
    const signal = this.controller.signal;
    Deno.serve({ port, signal }, this.app.handler.bind(this.app));
  }
}
