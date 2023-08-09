import { Application, Database, RouteGroup } from "@lib";
import { log, LogLevel, setupLogger, EnvironmentName } from "@utils";

/**
 * Server configuration object that defines
 * the environment, server, database, and application settings.
 */
type ServerConfig = {
  env: {
    name: EnvironmentName;
    logLevel: LogLevel;
  };
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
  /** Sets up the server environment. */
  private config: ServerConfig;

  /** Manages the database connection. */
  private db: Database;

  /** Encapsulates route and middleware configurations. */
  private app: Application;

  /** Used to signal when the server should stop. */
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
   * Starts the server.
   * @return {Promise<void>} Resolves when the server has successfully started.
   */
  public async start(): Promise<void> {
    await this.setupLogger();
    await this.db.connect();
    this.app.bootstrap();
    this.serve();
  }

  /**
   * Stops the server.
   * @param {DOMException} [reason] - Optional reason for stopping the server.
   * @return {Promise<void>} Resolves when the server has successfully stopped.
   */
  public async stop(reason?: DOMException): Promise<void> {
    await this.db.disconnect();
    this.controller.abort(reason);
    log.info("Server stopped.");
    if (reason) {
      log.error(reason);
    }
  }

  /** Set up the logger. */
  private async setupLogger(): Promise<void> {
    await setupLogger(this.config.env.logLevel);
    log.info("Logger setup complete.");
  }

  /** Serve HTTP requests. */
  private serve(): void {
    Deno.serve({
      port: this.config.server.port,
      hostname: this.config.server.hostname,
      signal: this.controller.signal,
      onListen: ({ port, hostname }) => {
        log.info(`Listening in ${this.config.env.name} on http://${hostname}:${port}`);
      },
    }, this.app.handler.bind(this.app));
  }
}
