import winston from 'winston';
import path from 'path';
import fs from 'fs';

// Ensure logs directory exists
const logsDir = path.join(process.cwd(), 'logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

// Define log levels
const logLevels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
};

// Define log colors
const logColors = {
  error: 'red',
  warn: 'yellow',
  info: 'green',
  http: 'magenta',
  debug: 'white',
};

// Add colors to winston
winston.addColors(logColors);

// Create custom format for console output
const consoleFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.colorize({ all: true }),
  winston.format.printf(({ timestamp, level, message, service, operation, ...meta }) => {
    const serviceInfo = service ? `[${service}${operation ? `:${operation}` : ''}]` : '';
    const metaString = Object.keys(meta).length ? ` ${JSON.stringify(meta)}` : '';
    return `${timestamp} ${level}: ${serviceInfo} ${message}${metaString}`;
  })
);

// Create custom format for file output
const fileFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.errors({ stack: true }),
  winston.format.json()
);

// Create the logger instance
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  levels: logLevels,
  format: fileFormat,
  transports: [
    // Error log file
    new winston.transports.File({
      filename: path.join(logsDir, 'error.log'),
      level: 'error',
      maxsize: 5242880, // 5MB
      maxFiles: 5,
    }),
    // Combined log file
    new winston.transports.File({
      filename: path.join(logsDir, 'combined.log'),
      maxsize: 5242880, // 5MB
      maxFiles: 5,
    }),
  ],
});

// Add console transport for non-production environments
if (process.env.NODE_ENV !== 'production') {
  logger.add(
    new winston.transports.Console({
      format: consoleFormat,
    })
  );
}

// Logger interface for structured logging
export interface LogContext {
  service?: string;
  operation?: string;
  model?: string;
  userId?: string;
  requestId?: string;
  duration?: number;
  [key: string]: any;
}

// Enhanced logger with structured context
export class Logger {
  private static instance: Logger;
  private logger: winston.Logger;

  private constructor() {
    this.logger = logger;
  }

  public static getInstance(): Logger {
    if (!Logger.instance) {
      Logger.instance = new Logger();
    }
    return Logger.instance;
  }

  public error(message: string, context?: LogContext, error?: Error): void {
    this.logger.error(message, {
      ...context,
      ...(error && { error: error.message, stack: error.stack }),
    });
  }

  public warn(message: string, context?: LogContext): void {
    this.logger.warn(message, context);
  }

  public info(message: string, context?: LogContext): void {
    this.logger.info(message, context);
  }

  public http(message: string, context?: LogContext): void {
    this.logger.http(message, context);
  }

  public debug(message: string, context?: LogContext): void {
    this.logger.debug(message, context);
  }

  // Performance logging
  public performance(message: string, duration: number, context?: LogContext): void {
    this.logger.info(message, {
      ...context,
      duration,
      type: 'performance',
    });
  }

  // API call logging
  public apiCall(
    service: string,
    operation: string,
    model: string,
    duration: number,
    success: boolean,
    error?: Error
  ): void {
    const level = success ? 'info' : 'error';
    const message = `API call ${success ? 'succeeded' : 'failed'}`;
    
    this.logger[level](message, {
      service,
      operation,
      model,
      duration,
      success,
      type: 'api_call',
      ...(error && { error: error.message }),
    });
  }

  // Service initialization logging
  public serviceInit(service: string, success: boolean, error?: Error): void {
    const message = `Service ${service} ${success ? 'initialized' : 'failed to initialize'}`;
    
    if (success) {
      this.logger.info(message, { service, type: 'service_init' });
    } else {
      this.logger.error(message, {
        service,
        type: 'service_init',
        ...(error && { error: error.message }),
      });
    }
  }
}

// Export default logger instance
export default Logger.getInstance();