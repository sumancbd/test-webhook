import { EventHandler } from './eventHandler.interface'
import { Injectable, Logger } from '@nestjs/common'

@Injectable()
export class UnhandledEventHandler implements EventHandler {
	private readonly logger = new Logger(UnhandledEventHandler.name)

	async handle(event): Promise<void> {
		this.logger.warn('Unhandled event', {
			action: event.action,
		})
	}
}
