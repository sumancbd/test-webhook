import { Module } from '@nestjs/common';
import { GitProviderConfigService } from './gitProviderConfig.service';
import { GitProviderFixture } from './gitProviderConfig.fixtures';

@Module({
  providers: [GitProviderConfigService, GitProviderFixture],
  exports: [GitProviderConfigService],
})
export class GitProviderConfigModule {}
