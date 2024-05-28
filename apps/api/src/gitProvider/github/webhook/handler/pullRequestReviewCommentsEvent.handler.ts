import { Injectable, Logger } from '@nestjs/common';
import { EventHandler } from './eventHandler.interface';
import { FeedbackFactory } from 'src/feedback/feedback.factory';

@Injectable()
export class PullRequestReviewCommentsEventHandler implements EventHandler {
  constructor(private readonly feedbackFactory: FeedbackFactory) {}

  logger = new Logger(PullRequestReviewCommentsEventHandler.name);

  async handle(event: any, gitProviderConfigId: string): Promise<void> {
    try {
      const port = await this.feedbackFactory.get(gitProviderConfigId);
      await port.handleEvent(event);
    } catch (error) {
      this.logger.error(error);
      return;
    }
  }
}
