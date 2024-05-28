import { HttpModule } from '@nestjs/axios'
import { Module, Provider } from '@nestjs/common'
import { PullRequestReviewThreadsEventHandler } from './webhook/handler/pullRequestReviewThreadsEvent.handler'
import { PullRequestReviewCommentsEventHandler } from './webhook/handler/pullRequestReviewCommentsEvent.handler'
import { PullRequestReviewsEventHandler } from './webhook/handler/pullRequestReviewsEvent.handler'
import { PullRequestsEventHandler } from './webhook/handler/pullRequestsEvent.handler'
import { GitHubWebhookController } from './webhook/githubWebhook.controller'
import { EventCodeEnum } from './EventCodeEnum'
import { GitProviderConfigModule } from 'src/gitProviderConfig/gitProviderConfig.module'
import { GithubWebhookService } from './webhook/githubWebhook.service'
import { UnhandledEventHandler } from './webhook/handler/unhandled.eventHandler'
import { EventHandlerFactory } from './webhook/handler/webhookEventHandler.factory'
import { PullRequestModule } from 'src/pullRequest/pullRequest.module'
import { FeedbackModule } from 'src/feedback/feedback.module'


const WebhookEventHandlerMapProvider: Provider = {
	provide: 'EVENT_HANDLER_MAP',
	inject: [PullRequestReviewCommentsEventHandler,PullRequestReviewsEventHandler,PullRequestsEventHandler,PullRequestReviewThreadsEventHandler ],
	useFactory: (
		pullRequestReviewCommentsEventHandler: PullRequestReviewCommentsEventHandler,
		pullRequestReviewsEventHandler: PullRequestReviewsEventHandler,
		pullRequestsEventHandler: PullRequestsEventHandler,
		pullRequestReviewThreadsEventHandler: PullRequestReviewThreadsEventHandler,
		
	) => {
		return new Map<string, any>([
			[
				EventCodeEnum
					.PULL_REQUEST as unknown as string,
					pullRequestsEventHandler
			],
			[
				EventCodeEnum.PULL_REQUEST_REVIEW as unknown as string,
				pullRequestReviewsEventHandler
			],
			[
				EventCodeEnum.PULL_REQUEST_REVIEW_COMMENT as unknown as string,
				pullRequestReviewCommentsEventHandler
			],
			[
				EventCodeEnum.PULL_REQUEST_REVIEW_COMMENT_THREAD as unknown as string,
				pullRequestReviewThreadsEventHandler
			]
		])
	}
}

@Module({
	controllers: [GitHubWebhookController],
	imports: [
		GitProviderConfigModule,
		HttpModule,
		PullRequestModule,
		FeedbackModule
	],
	providers: [
		GithubWebhookService,
		PullRequestReviewCommentsEventHandler,
		PullRequestReviewsEventHandler,
		WebhookEventHandlerMapProvider,
		PullRequestReviewThreadsEventHandler,
		UnhandledEventHandler,
		EventHandlerFactory,
		PullRequestsEventHandler,
	],
	exports: []
})
export class GithubModule {}
