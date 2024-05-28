import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Feedback, Prisma } from '@prisma/client';
import { FeedbackAdapter } from '../feedback.adapter';
import { GithubPullRequestPort } from 'src/pullRequest/github/githubPullRequest.port';

@Injectable()
export class GithubFeedbackPort implements FeedbackAdapter {
  constructor(
    private prisma: PrismaService,
    private githubPullRequestPort: GithubPullRequestPort
  ) {}

  async handleEvent(event: any) {
    switch (event.action) {
      case 'created':
        await this.create(
          {
            feedback: event?.comment?.body,
            feedbackId: String(event?.comment?.id),
            commentedBy: event?.comment?.user?.login,
          },
          String(event?.pull_request?.id)
        );
        break;
      case 'edited':
        await this.update(String(event?.comment?.id), {
          feedback: event?.comment?.body,
        });
        break;
      case 'deleted':
        await this.remove(String(event?.comment?.id));
        break;
      default:
        break;
    }
  }

  async create(createFeedbackDto: Prisma.FeedbackCreateInput, prId: string): Promise<Feedback> {
    const pullRequest = await this.githubPullRequestPort.findOne(prId);
    return this.prisma.feedback.create({
      data: { ...createFeedbackDto, pullRequest: { connect: { id: pullRequest.id } } },
    });
  }

  async update(feedbackId: string, updateFeedbackDto: Prisma.FeedbackUpdateInput):Promise<Feedback> {
    const feedback = await this.findOne(feedbackId);

    if (!feedback) throw new NotFoundException('Feedback not found');
    return this.prisma.feedback.update({
      where: { id: feedback.id },
      data: updateFeedbackDto,
    });
  }

  async remove(feedbackId: string): Promise<Feedback> {
    const feedback = await this.findOne(feedbackId);

    if (!feedback) throw new NotFoundException('Feedback not found');
    return this.prisma.feedback.update({
      where: { id: feedback.id },
      data: { deletedAt: new Date() },
    });
  }

  async findOne(feedbackId: string): Promise<Feedback> {
    return this.prisma.feedback.findFirst({
      where: {
        feedbackId,
        deletedAt: {
          isSet: false,
        },
      },
    });
  }
  
}
