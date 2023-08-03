import { Application, Database, RouteGroup } from "@lib";

/** Server configuration object that defines the server, database, and application settings. */
type ServerConfig = {
  server: {
    port: number;
    hostname: string;
  };
  db: {
    user: string;
    database: string;
    hostname: string;
    port: number;
    password?: string;
  };
  app: {
    apiPrefix: string;
    apiRoutes: RouteGroup[];
  };
};

/** Server interface defining the start and stop methods. */
interface Server {
  start(): Promise<void>;
  stop(reason?: DOMException): Promise<void>;
}

/**
 * Class that manages the server environment.
 * @implements {Server}
 */
export class ServerImpl implements Server {
  /** Configuration object that sets up the server environment. */
  private config: ServerConfig;

  /** Database instance that connects to the database. */
  private db: Database;

  /** Application instance that encapsulates route and middleware configurations. */
  private app: Application;

  /** AbortController instance used to signal when the server should stop. */
  private controller: AbortController;

  /**
   * @param {ServerConfig} config - Configuration object for the server.
   */
  constructor(config: ServerConfig) {
    this.config = config;
    this.db = new Database(this.config.db);
    this.app = new Application(this.config.app);
    this.controller = new AbortController();
  }

  /**
   * @return {Promise<void>} Resolves when the server has successfully started.
   */
  public async start(): Promise<void> {
    await this.db.connect();
    this.app.bootstrap();
    this.serve();
  }

  /**
   * @param {DOMException} [reason] - Optional reason for stopping the server.
   * @return {Promise<void>} Resolves when the server has successfully stopped.
   */
  public async stop(reason?: DOMException): Promise<void> {
    await this.db.disconnect();
    this.controller.abort(reason);
    console.log("Server stopped.");
    if (reason) {
      console.error(reason);
    }
  }

  /** Serve the application. */
  private serve(): void {
    const port = this.config.server.port;
    const hostname = this.config.server.hostname;
    const signal = this.controller.signal;
    Deno.serve({ port, hostname, signal }, this.app.handler.bind(this.app));
  }
}
