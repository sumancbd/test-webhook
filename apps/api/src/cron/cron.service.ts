import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import * as dayjs from 'dayjs';
import { AppConfigService } from 'src/app-config/app-config.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { PRStatus } from '@prisma/client';

@Injectable()
export class CronService {
  private readonly logger = new Logger(CronService.name);

  constructor(
    private readonly httpService: HttpService,
    private readonly appConfigService: AppConfigService,
    private prisma: PrismaService
  ) {}

  @Cron('0 */10 * * * *')
  async handleCron() {
    this.logger.debug('Cron job started');

    const prs = await this.getPullRequests();

    const now = dayjs();
    const oldPrs = prs.filter((pr) => {
      const createdAt = dayjs(pr.createdAt);
      return now.diff(createdAt, 'hour') > 3;
    });

    if (oldPrs.length > 0) {
      await this.sendSlackNotification(oldPrs);
    }
    this.logger.debug('Cron job finished');
  }

  private async getPullRequests() {
    return await this.prisma.pullRequest.findMany({
      where: {
        status:PRStatus.OPEN,
        deletedAt: {
          isSet: false,
        },
      },
    })
  }

  private async sendSlackNotification(prs: any[]) {
    const slackWebhookUrl = this.appConfigService.slack.url;
    const message = prs
      .map(
        (pr) =>
          `PR <${pr.url}|${pr.title}> created at ${dayjs(pr.createdAt).format('YYYY-MM-DD HH:mm:ss')} is older than 3 hours and not reviewed.`
      )
      .join('\n');
  
    const payload = {
      text: message,
    };
  
    try {
      await firstValueFrom(this.httpService.post(slackWebhookUrl, payload));
      this.logger.debug('Slack notification sent successfully');
    } catch (error) {
      this.logger.error('Error sending Slack notification', error);
    }
  }
  
}
