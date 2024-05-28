import { Inject, Injectable } from '@nestjs/common'
import { EventHandler } from './eventHandler.interface'
import { UnhandledEventHandler } from './unhandled.eventHandler'

@Injectable()
export class EventHandlerFactory {
	constructor(
		@Inject('EVENT_HANDLER_MAP')
		private readonly eventHandlerMapping: Map<string, EventHandler>,
		private readonly unhandledEventHandler: UnhandledEventHandler
	) {}

	get(eventType: string): EventHandler {
		return this.eventHandlerMapping.get(eventType) || this.unhandledEventHandler
	}
}
