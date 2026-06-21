import winston from 'winston';
import path from 'path';

class LoggerService {
    constructor() {
        // Define log formats
        this.logFormat = winston.format.combine(
            winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
            winston.format.errors({ stack: true }),
            winston.format.splat(),
            winston.format.json()
        );

        // In ES Modules, use import.meta.dirname instead of __dirname
        const currentDir = import.meta.dirname;

        // Initialize the Winston logger instance
        this.logger = winston.createLogger({
            level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
            format: this.logFormat,
            transports: [
                // Write all logs with level 'error' and below to error.log
                new winston.transports.File({ 
                    filename: path.join(currentDir, '../logs/error.log'), 
                    level: 'error' 
                }),
                // Write all logs with level 'info' and below to combined.log
                new winston.transports.File({ 
                    filename: path.join(currentDir, '../logs/combined.log') 
                })
            ]
        });

        // If not in production, log to the console with pretty colors
        if (process.env.NODE_ENV !== 'production') {
            this.logger.add(new winston.transports.Console({
                format: winston.format.combine(
                    winston.format.colorize(),
                    winston.format.printf(({ timestamp, level, message, ...metadata }) => {
                        let msg = `[${timestamp}] [${level}]: ${message}`;
                        if (Object.keys(metadata).length && metadata.stack === undefined) {
                            msg += ` ${JSON.stringify(metadata)}`;
                        }
                        return msg;
                    })
                )
            }));
        }
    }

    // Explicit methods for different log levels (OOP Encapsulation)
    info(message, metadata = {}) {
        this.logger.info(message, metadata);
    }

    error(message, errorObject = null) {
        this.logger.error(message, errorObject ? { error: errorObject } : {});
    }

    warn(message, metadata = {}) {
        this.logger.warn(message, metadata);
    }

    debug(message, metadata = {}) {
        this.logger.debug(message, metadata);
    }

    // Middleware method to track HTTP requests automatically
    getRequestLogger() {
        return (req, res, next) => {
            const start = Date.now();
            
            res.on('finish', () => {
                const duration = Date.now() - start;
                const logMessage = `${req.method} ${req.originalUrl} ${res.statusCode} - ${duration}ms`;
                
                const meta = {
                    method: req.method,
                    url: req.originalUrl,
                    status: res.statusCode,
                    duration: `${duration}ms`,
                    ip: req.ip
                };

                if (res.statusCode >= 400) {
                    this.error(logMessage, meta);
                } else {
                    this.info(logMessage, meta);
                }
            });

            next();
        };
    }
}

// Export a singleton instance using ESM syntax
const logger = new LoggerService();
export default logger;