import { Module } from '@nestjs/common';
import { PullRequestModule } from 'src/pullRequest/pullRequest.module';
import { FeedbackFactory } from './feedback.factory';
import { GitProviderConfigModule } from 'src/gitProviderConfig/gitProviderConfig.module';

@Module({
  imports: [PullRequestModule, GitProviderConfigModule],
  providers: [FeedbackFactory],
  exports: [FeedbackFactory],
})
export class FeedbackModule {}
