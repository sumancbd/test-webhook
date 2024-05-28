import { Injectable, Logger } from '@nestjs/common';
import { EventHandler } from './eventHandler.interface';

@Injectable()
export class PullRequestReviewThreadsEventHandler implements EventHandler {
  logger = new Logger(PullRequestReviewThreadsEventHandler.name);

  async handle(event): Promise<void> {
    this.logger.warn('PullRequestReviewThreadsEventHandler event', {
      action: event.action,
    });
  }
}
