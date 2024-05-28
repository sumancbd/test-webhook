import { Injectable, Logger } from '@nestjs/common';
import { EventHandler } from './eventHandler.interface';

@Injectable()
export class PullRequestReviewsEventHandler implements EventHandler {
  logger = new Logger(PullRequestReviewsEventHandler.name);

  async handle(event): Promise<void> {
    this.logger.warn('PullRequestReviewsEventHandler event', {
      action: event.action,
    });
  }
}
