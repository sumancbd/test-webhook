
export interface EventHandler {
	handle(
		notificationItem:any,
		gitProviderConfigId?: string
	): Promise<void>
}
