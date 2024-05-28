import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { PRStatus, Prisma, PullRequest } from '@prisma/client';
import { PullRequestAdapter } from '../pullRequest.adapter';

@Injectable()
export class GithubPullRequestPort implements PullRequestAdapter {
  logger = new Logger(GithubPullRequestPort.name);

  constructor(private prisma: PrismaService) {}

  async handleEvent(event: any) {
    switch (event.action) {
      case 'opened':
        await this.create({
          title: event?.pull_request?.title,
          createdBy: event?.sender?.login,
          prId: String(event?.pull_request?.id),
          projectId: String(event?.repository?.id),
          projectName: event?.repository?.name,
          url: event?.pull_request?.html_url
        });
        break;
      case 'closed':
        if (event?.pull_request?.merged) {
          await this.update(String(event?.pull_request?.id), {
            mergedBy: event?.pull_request?.merged_by?.login,
            mergedAt: event?.pull_request?.merged_at,
            status: PRStatus.MERGED,
          });
        } else {
          await this.remove(String(event?.pull_request?.id));
        }
        break;
      default:
        break;
    }
  }

  async create(createPullRequestDto: Prisma.PullRequestCreateInput): Promise<PullRequest> {
    return await this.prisma.pullRequest.create({
      data: {
        ...createPullRequestDto,
        createdAt: new Date(),
      },
    });
  }

  async findOne(prId: string): Promise<PullRequest> {
    return await this.prisma.pullRequest.findFirst({
      where: {
        prId,
        deletedAt: {
          isSet: false,
        },
      },
    });
  }

  async update(prId: string, updatePrDto: Prisma.PullRequestUpdateInput): Promise<PullRequest> {
    const pullRequest = await this.findOne(prId);

    if (!pullRequest) throw new NotFoundException('pull request not found');
    return this.prisma.pullRequest.update({
      where: { id: pullRequest.id },
      data: updatePrDto,
    });
  }

  async remove(prId: string): Promise<PullRequest> {
    const pullRequest = await this.findOne(prId);

    if (!pullRequest) throw new NotFoundException('pull request not found');
    const result = await this.prisma.pullRequest.update({
      where: { id: pullRequest.id },
      data: { deletedAt: new Date(), status: PRStatus.CLOSED },
    });

    await this.prisma.feedback.updateMany({
      where: { pullRequestId: pullRequest.id },
      data: {
        deletedAt: new Date(),
      },
    });
    return result;
  }
}
