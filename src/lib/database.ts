import { Client } from "@deps";

/** Type defining the configuration needed to connect to a database. */
type DatabaseConfig = {
  user: string;
  database: string;
  hostname: string;
  port: number;
  password?: string;
};

/** Interface defining the basic operations for a database. */
interface Database {
  connect(): Promise<void>;
  disconnect(): Promise<void>;
}

/**
 * Class that manages the database connection.
 * @implements {Database}
 */
export class DatabaseImpl implements Database {
  /** Client instance used to communicate with the database. */
  private client: Client;

  /**
   * @param {DatabaseConfig} config - Configuration for the database.
   */
  constructor(config: DatabaseConfig) {
    this.client = new Client(config);
  }

  /**
   * Connects to the database.
   * @returns {Promise<void>}
   */
  public async connect(): Promise<void> {
    await this.client.connect();
    console.log("Database connected.");
  }

  /**
   * Disconnects from the database.
   * @returns {Promise<void>}
   */
  public async disconnect(): Promise<void> {
    await this.client.end();
    console.log("Database disconnected.");
  }
}
