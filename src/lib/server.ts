import { Application } from "./application.ts";

type ServerConfig = {
  app: {
    port: number;
  };
};

export class Server {
  private application: Application;
  private config: ServerConfig;

  constructor(config: ServerConfig) {
    this.application = new Application();
    this.config = config;
  }

  public start(): void {
    this.application.bootstrap();
    this.serve(this.config.app.port);
  }

  // public stop(reason?: DOMException): void {}

  private serve(port: number): void {
    Deno.serve({ port }, this.application.handler.bind(this.application));
  }
}
