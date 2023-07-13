import util from 'util';
import * as winston from 'winston';

interface LoggerMetadata extends Record<string, unknown> {
  error?: Error;
  errorMessage?: string;
}

export class LoggerService {
  private logger: winston.Logger;

  constructor(name: string) {
    if (process.env.NODE_ENV === 'production') {
      this.logger = winston.createLogger({
        format: winston.format.combine(
          winston.format.label({ label: name }),
          winston.format.timestamp(),
          winston.format.metadata({
            fillExcept: ['level', 'message', 'label', 'timestamp'],
          }),
          winston.format.json()
        ),
        transports: [new winston.transports.Console()],
      });
    } else {
      const format = winston.format.printf((options) => {
        const { level, message, label, timestamp, metadata } = options;
        return `${timestamp} [${label}] ${level}: ${message} ${this.renderMetadata(metadata)}`;
      });
      this.logger = winston.createLogger({
        format: winston.format.combine(
          winston.format.colorize(),
          winston.format.label({ label: name }),
          winston.format.timestamp(),
          winston.format.metadata({
            fillExcept: ['level', 'message', 'label', 'timestamp'],
          }),
          format
        ),
        level: 'debug',
        transports: [new winston.transports.Console()],
      });
    }
  }

  info(message: string, meta?: LoggerMetadata): void {
    this.logger.info(message, meta);
  }

  warn(message: string, meta?: LoggerMetadata): void {
    this.logger.warn(message, meta);
  }

  error(message: string, meta?: LoggerMetadata): void {
    this.logger.error(message, meta);
  }

  private getMetadata(meta?: LoggerMetadata) {
    const metadata = meta || {};
    return this.sanitizeMetadata(metadata);
  }

  private sanitizeMetadata(metadata: LoggerMetadata) {
    // TODO sanitize and format
    return metadata;
  }

  private renderMetadata(metadata: LoggerMetadata) {
    if (Object.keys(metadata).length) {
      return util.inspect(metadata, true, null, true);
    }
    return '';
  }
}
