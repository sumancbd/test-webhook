import { Module } from '@nestjs/common';
import {  PullRequestStatisticService } from './pullRequestStatistic.service';
import { PullRequestStatisticController } from './pullRequestStatistic.controller';

@Module({
  controllers: [PullRequestStatisticController],
  providers: [PullRequestStatisticService],
  exports: [],
})
export class PullRequestStatisticModule {}
