import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { PRStatus } from '@prisma/client';

@Injectable()
export class PullRequestStatisticService {
  logger = new Logger(PullRequestStatisticService.name);

  constructor(private prisma: PrismaService) {}

  async findPrInRange(startDate: Date, endDate: Date) {
    const pullRequests = await this.prisma.pullRequest.findMany({
      where: {
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      },
    });
    return {
      count: pullRequests.length,
      pullRequests: pullRequests,
    };
  }

  async findMergedPrInRange(startDate: Date, endDate: Date) {
    const pullRequests = await this.prisma.pullRequest.findMany({
      where: {
        status: PRStatus.MERGED,
        mergedAt: {
          gte: startDate,
          lte: endDate,
        },
      },
    });
    return {
      count: pullRequests.length,
      pullRequests: pullRequests,
    };
  }

  async countMergedPrByUser(githubUsername: string) {
    const pullRequests = await this.prisma.pullRequest.findMany({
      where: {
        status: PRStatus.MERGED,
        mergedBy: githubUsername,
      },
    });
    return {
      count: pullRequests.length,
      pullRequests: pullRequests,
    };
  }

  async getPrsMergedAfter3Hours() {
    const allMergedPrs = await this.prisma.pullRequest.findMany({
      where: {
        status: 'MERGED',
      },
    });

    const threeHoursInMilliseconds = 3 * 60 * 60 * 1000;
    const prsMergedAfter3Hours = allMergedPrs.filter((pr) => {
      const createdAt = new Date(pr.createdAt).getTime();
      const mergedAt = new Date(pr.mergedAt).getTime();
      return mergedAt - createdAt > threeHoursInMilliseconds;
    });

    return {
      count: prsMergedAfter3Hours.length,
      prs: prsMergedAfter3Hours,
    };
  }
}
