type LogLevel = "info" | "warn" | "error" | "debug";

class Logger {
  private isProduction = import.meta.env.PROD;

  private formatMessage(level: LogLevel, message: string, context?: any) {
    const timestamp = new Date().toISOString();
    return [
      `[${level.toUpperCase()}] ${timestamp}: ${message}`,
      context,
    ].filter(Boolean);
  }

  info(message: string, context?: any) {
    if (this.isProduction) return; // Optional: hide info logs in prod
    console.log(...this.formatMessage("info", message, context));
  }

  warn(message: string, context?: any) {
    console.warn(...this.formatMessage("warn", message, context));
  }

  error(message: string, context?: any) {
    console.error(...this.formatMessage("error", message, context));
  }

  debug(message: string, context?: any) {
    if (this.isProduction) return;
    console.debug(...this.formatMessage("debug", message, context));
  }
}

export const logger = new Logger();
