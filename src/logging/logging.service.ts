import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class LoggingService {
  private readonly logger = new Logger('Custom Logger');

  // Log to console
  log(message: string, context?: string): void {
    this.logger.log(`${message} ${context}`);
  }

  // Log an error
  error(message: string, trace?: string, context?: string): void {
    this.logger.error(message, trace, context);
  }

  // Log a warning
  warn(message: string, context?: string): void {
    this.logger.warn(message, context);
  }
}
