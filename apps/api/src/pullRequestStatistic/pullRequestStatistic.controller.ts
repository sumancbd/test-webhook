import { Body, Controller, Get, Param, Post, UsePipes } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { PullRequestStatisticService } from './pullRequestStatistic.service';
import { JoiValidationPipe } from 'src/joi-validation-pipe/joi-validation-pipe.interceptor';
import { DateRangeDto, dateRangeSchema } from './pullRequestStatistic.dto';

@ApiTags('PullRequestStatistic')
@Controller('pullRequestStatisticService')
export class PullRequestStatisticController {
  constructor(private readonly pullRequestStatisticService: PullRequestStatisticService) {}

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get report of PR raised in specific time',
  })
  @Post('report/raised')
  @UsePipes(new JoiValidationPipe(dateRangeSchema, 'body'))
  findPrInRange(@Body() dateRangeDto: DateRangeDto) {
    return this.pullRequestStatisticService.findPrInRange(
      new Date(dateRangeDto.startDate),
      new Date(dateRangeDto.endDate)
    );
  }

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get report of PR merged in specific time',
  })
  @Post('report/merged')
  @UsePipes(new JoiValidationPipe(dateRangeSchema, 'body'))
  findMergedPrInRange(@Body() dateRangeDto: DateRangeDto) {
    return this.pullRequestStatisticService.findMergedPrInRange(
      new Date(dateRangeDto.startDate),
      new Date(dateRangeDto.endDate)
    );
  }

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get report of PR merged by user',
  })
  @Get('report/merged/user/:githubUsername')
  countMergedPrByUser(@Param('githubUsername') githubUsername: string) {
    return this.pullRequestStatisticService.countMergedPrByUser(githubUsername);
  }

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get report of PR merged after 3 hour',
  })
  @Get('report/merged/after-three-hour')
  getPrsMergedAfter3Hours() {
    return this.pullRequestStatisticService.getPrsMergedAfter3Hours();
  }
}
