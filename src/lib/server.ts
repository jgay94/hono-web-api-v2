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
   * Start the server.
   * @return {Promise<void>} Resolves when the server has successfully started.
   */
  public async start(): Promise<void> {
    await this.initLogger();
    await this.db.connect();
    this.app.bootstrap();
    this.serve();
  }

  /**
   * Stop the server.
   * @param {DOMException} [reason] - Optional reason for stopping the server.
   * @return {Promise<void>} Resolves when the server has successfully stopped.
   */
  public async stop(reason?: DOMException): Promise<void> {
    await this.db.disconnect();
    this.controller.abort(reason);
    log.info("Server stopped.");
    if (reason) {
      log.debug(`Abort reason: ${reason}`);
    }
  }

  /** Initialize the logger. */
  private async initLogger(): Promise<void> {
    const logLevel = this.config.env.logLevel;
    await setupLogger(logLevel);
    log.info(`Logger initialized. Current log level: ${logLevel}.`);
  }

  /** Serve HTTP requests. */
  private serve(): void {
    Deno.serve({
      port: this.config.server.port,
      hostname: this.config.server.hostname,
      signal: this.controller.signal,
      onListen: ({ port, hostname }) => {
        log.info(`Listening on http://${hostname}:${port}. Current environment: ${this.config.env.name}.`);
      },
    }, this.app.handler.bind(this.app));
  }
}
