import { Injectable, Logger } from '@nestjs/common';
import { EventHandler } from './eventHandler.interface';
import { PullRequestFactory } from 'src/pullRequest/pullRequest.factory';

@Injectable()
export class PullRequestsEventHandler implements EventHandler {
  constructor(private readonly pullRequestFactory: PullRequestFactory) {}

  logger = new Logger(PullRequestsEventHandler.name);

  async handle(event:any, gitProviderConfigId: string): Promise<void> {
    try {
      const port = await this.pullRequestFactory.get(gitProviderConfigId)
      await port.handleEvent(event);
    } catch (error) {
      this.logger.log(error);
      return;
    }
  }
}
