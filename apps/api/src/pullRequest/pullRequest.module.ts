import { Module } from '@nestjs/common';
import { GitProviderConfigModule } from 'src/gitProviderConfig/gitProviderConfig.module';
import { PullRequestFactory } from './pullRequest.factory';

@Module({
  imports:[GitProviderConfigModule],
  controllers: [],
  providers: [PullRequestFactory],
  exports: [PullRequestFactory],
})
export class PullRequestModule {}
