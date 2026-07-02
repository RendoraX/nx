type LogLevel = "info" | "warn" | "error" | "debug";

interface LogContext {
  requestId?: string;
  userId?: string;
  [key: string]: unknown;
}

class Logger {
  private format(level: LogLevel, message: string, context?: LogContext) {
    return JSON.stringify({
      level,
      message,
      timestamp: new Date().toISOString(),
      ...context,
    });
  }

  info(message: string, context?: LogContext) {
    console.info(this.format("info", message, context));
  }

  warn(message: string, context?: LogContext) {
    console.warn(this.format("warn", message, context));
  }

  error(message: string, context?: LogContext) {
    console.error(this.format("error", message, context));
  }

  debug(message: string, context?: LogContext) {
    console.debug(this.format("debug", message, context));
  }
}

export const logger = new Logger();
export type { LogContext, LogLevel };
