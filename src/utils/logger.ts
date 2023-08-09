import * as log from "@std/log/mod.ts";

export { log };

/** Represents the log levels for the logger. */
export type LogLevel = typeof LOG_LEVELS[number];
export const LOG_LEVELS = [
  "NOTSET",
  "DEBUG",
  "INFO",
  "WARNING",
  "ERROR",
  "CRITICAL",
] as const;

const DEFAULT_LOGS_DIR = Deno.cwd() + "/logs";
const DEFAULT_CONSOLE_HANDLER = "console";
const DEFAULT_FILE_HANDLER = "file";

/**
 * Configures and sets up the Deno logger with console and file handlers.
 *
 * @param {LogLevel} logLevel - The minimum log level to display and write to file.
 * @returns {Promise<void>}
 */
export async function setupLogger(logLevel: LogLevel): Promise<void> {
  await ensureLogsDirectoryExists();
  log.setup({
    handlers: {
      console: new log.handlers.ConsoleHandler(logLevel, {
        formatter: (logRecord) => {
          try {
            const msg = logRecord.msg;
            const levelName = logRecord.levelName;
            const timestamp = new Date().toLocaleString(); // human-readable format
            return `[${timestamp}] ${levelName} ${msg}`;
          } catch (error) {
            console.error("Failed to format log message: ", error);
            return "";
          }
        },
      }),
      file: new log.handlers.FileHandler(logLevel, {
        filename: getCurrentLogFilename(),
        formatter: (logRecord) => {
          try {
            const msg = logRecord.msg;
            const levelName = logRecord.levelName;
            const timestamp = new Date().toISOString(); // ISO format
            return `[${timestamp}] ${levelName} ${msg}`;
          } catch (error) {
            console.error("Failed to format log message: ", error);
            return "";
          }
        },
      }),
    },
    loggers: {
      default: {
        level: logLevel,
        handlers: [DEFAULT_CONSOLE_HANDLER, DEFAULT_FILE_HANDLER],
      },
    },
  });
}

/**
 * Generates the current log filename based on the current date.
 *
 * @returns {string} - The filename for the log file.
 */
function getCurrentLogFilename(): string {
  const isoDateSeparator = "T";
  const currentDate = new Date().toISOString().split(isoDateSeparator)[0]; // Get the date in the format of YYYY-MM-DD
  return `${DEFAULT_LOGS_DIR}/app-${currentDate}.log`;
}

/**
 * Creates the logs directory if it doesn't exist.
 *
 * @returns {Promise<void>}
 */
async function ensureLogsDirectoryExists(): Promise<void> {
  try {
    await Deno.stat(DEFAULT_LOGS_DIR);
  } catch (error) {
    if (error instanceof Deno.errors.NotFound) {
      await Deno.mkdir(DEFAULT_LOGS_DIR);
    } else {
      throw error;
    }
  }
}
