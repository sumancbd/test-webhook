import {
	Controller,
	HttpCode,
	HttpStatus,
	Logger,
	Param,
	Post,
	Req,
	UseGuards
} from '@nestjs/common'

import { Request } from 'express'
import { GithubWebhookService } from './githubWebhook.service'
import { GitHubWebhookSignatureGuard } from './guard/githubWebhookSignature.guard'
import { Public } from 'src/auth/decorators'

@Controller()
export class GitHubWebhookController {
	private readonly logger = new Logger(GitHubWebhookController.name)

	constructor(private readonly githubWebhookService: GithubWebhookService) {}

	@Post('/github/webhook/:gitProviderConfigId')
	@HttpCode(HttpStatus.ACCEPTED)
	@Public()
	@UseGuards(GitHubWebhookSignatureGuard)
	async processWebhook(
		@Req() request: Request,
		@Param('gitProviderConfigId') gitProviderConfigId: string
	) {
		this.logger.log({ gitProviderConfigId: gitProviderConfigId }, 'Received github webhook')

		const eventCode = request.headers["x-github-event"]
		await this.githubWebhookService.receiveEvent(
			eventCode as string,
			gitProviderConfigId,
			request.body
		)
		return '[accepted]'
	}
}
