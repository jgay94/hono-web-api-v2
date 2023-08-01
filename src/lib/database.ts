import { Client } from "@deps";

type DatabaseConfig = {
  user: string;
  database: string;
  hostname: string;
  port: number;
  password?: string;
};

interface Database {
  connect(): Promise<void>;
  disconnect(): Promise<void>;
}

export class DatabaseImpl implements Database {
  private client: Client;

  constructor(config: DatabaseConfig) {
    this.client = new Client(config);
  }

  public async connect(): Promise<void> {
    await this.client.connect();
    console.log("Database connected.");
  }

  public async disconnect(): Promise<void> {
    await this.client.end();
    console.log("Database disconnected.");
  }
}
