import { Module } from '@nestjs/common';
import { GitProviderConfigService } from './gitProviderConfig.service';
import { GitProviderFixture } from './gitProviderConfig.fixtures';
import { GitProviderConfigController } from './gitProviderConfig.controller';

@Module({
  controllers:[GitProviderConfigController],
  providers: [GitProviderConfigService, GitProviderFixture],
  exports: [GitProviderConfigService],
})
export class GitProviderConfigModule {}
