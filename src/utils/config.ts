import { load } from "@std/dotenv/mod.ts";
import { LOG_LEVELS, LogLevel, log } from "./logger.ts";

/** Represents the various configuration options. */
type Configuration = {
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
    password: string;
  };
};

/** Represents the possible environment names. */
export type EnvironmentName = typeof ENVIRONMENT_NAMES[number];
const ENVIRONMENT_NAMES = ["production", "staging", "development"] as const;

function parseEnvironmentName(
  value: string | undefined,
  defaultValue: EnvironmentName,
): EnvironmentName {
  if (ENVIRONMENT_NAMES.includes(value as EnvironmentName)) {
    return value as EnvironmentName;
  }
  log.warning(`Invalid environment name in .env: ${value}. Using default: ${defaultValue}.`)
  return defaultValue;
}

function parseLogLevel(
  value: string | undefined,
  defaultValue: LogLevel,
): LogLevel {
  if (LOG_LEVELS.includes(value as LogLevel)) {
    return value as LogLevel;
  }
  log.warning(`Invalid log level in .env: ${value}. Using default: ${defaultValue}.`);
  return defaultValue;
}

function parseNumber(value: string | undefined, defaultValue: number): number {
  if (value) {
    const result = parseInt(value, 10);
    if (!isNaN(result)) return result;
  }
  log.warning(`Invalid number in .env: ${value}. Using default: ${defaultValue}.`);
  return defaultValue;
}

const env = await load();

export const config: Configuration = {
  env: {
    name: parseEnvironmentName(env.ENVIRONMENT_NAME, "development"),
    logLevel: parseLogLevel(env.ENVIRONMENT_LOG_LEVEL, "INFO"),
  },
  server: {
    port: parseNumber(env.SERVER_PORT, 8080),
    hostname: env.SERVER_HOSTNAME || "localhost",
  },
  db: {
    user: env.DATABASE_USERNAME,
    database: env.DATABASE_NAME,
    hostname: env.DATABASE_HOSTNAME,
    port: parseNumber(env.DATABASE_PORT, 5432),
    password: env.DATABASE_PASSWORD,
  },
};
