// Production-ready logging utility
// Only logs in development, silently fails in production

type LogLevel = 'error' | 'warn' | 'info' | 'debug';

interface LogEntry {
  level: LogLevel;
  message: string;
  error?: Error;
  metadata?: Record<string, any>;
  timestamp: string;
}

class Logger {
  private isDevelopment = process.env.NODE_ENV === 'development';

  private formatMessage(entry: LogEntry): string {
    const parts = [
      `[${entry.timestamp}]`,
      `[${entry.level.toUpperCase()}]`,
      entry.message,
    ];

    if (entry.metadata && Object.keys(entry.metadata).length > 0) {
      parts.push(JSON.stringify(entry.metadata));
    }

    if (entry.error) {
      parts.push(`Error: ${entry.error.message}`);
      if (this.isDevelopment && entry.error.stack) {
        parts.push(`Stack: ${entry.error.stack}`);
      }
    }

    return parts.join(' ');
  }

  private log(level: LogLevel, message: string, error?: Error, metadata?: Record<string, any>) {
    if (!this.isDevelopment) return;

    const entry: LogEntry = {
      level,
      message,
      error,
      metadata,
      timestamp: new Date().toISOString(),
    };

    const formatted = this.formatMessage(entry);

    switch (level) {
      case 'error':
        console.error(formatted);
        break;
      case 'warn':
        console.warn(formatted);
        break;
      case 'info':
        console.info(formatted);
        break;
      case 'debug':
        console.debug(formatted);
        break;
    }
  }

  error(message: string, error?: Error, metadata?: Record<string, any>) {
    this.log('error', message, error, metadata);
  }

  warn(message: string, metadata?: Record<string, any>) {
    this.log('warn', message, undefined, metadata);
  }

  info(message: string, metadata?: Record<string, any>) {
    this.log('info', message, undefined, metadata);
  }

  debug(message: string, metadata?: Record<string, any>) {
    this.log('debug', message, undefined, metadata);
  }
}

export const logger = new Logger();

