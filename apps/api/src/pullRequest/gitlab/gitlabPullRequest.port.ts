import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma, PullRequest } from '@prisma/client';
import { PullRequestAdapter } from '../pullRequest.adapter';

@Injectable()
export class GitlabPullRequestPort implements PullRequestAdapter {
  logger = new Logger(GitlabPullRequestPort.name);

  constructor(private _prisma: PrismaService) {}

  async handleEvent(_event: any) {
    throw new Error('Method not implemented.');
  }

  async create(_createPullRequestDto: Prisma.PullRequestCreateInput): Promise<PullRequest> {
    throw new Error('Method not implemented.');
  }

  async findOne(_prId: string): Promise<PullRequest> {
    throw new Error('Method not implemented.');
  }

  async update(_prId: string, _updatePrDto: Prisma.PullRequestUpdateInput): Promise<PullRequest> {
    throw new Error('Method not implemented.');
  }

  async remove(_prId: string): Promise<PullRequest> {
    throw new Error('Method not implemented.');
  }
}
