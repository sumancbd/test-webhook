import { Injectable, Logger } from '@nestjs/common';
import { EventHandlerFactory } from './handler/webhookEventHandler.factory';

@Injectable()
export class GithubWebhookService {
  constructor(private readonly eventHandlerFactory: EventHandlerFactory) {}

  logger = new Logger(GithubWebhookService.name);

  async receiveEvent(eventCode: string, gitProviderConfigId: string, event: any) {
    const eventHandler = this.eventHandlerFactory.get(eventCode as unknown as string);
    await eventHandler.handle(event, gitProviderConfigId);

    this.logger.log('Github event processed successfully', {
      action: event.action,
    });
  }
}
