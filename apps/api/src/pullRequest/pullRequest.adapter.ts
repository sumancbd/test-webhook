import { Prisma, PullRequest } from '@prisma/client';

export interface PullRequestAdapter {
  handleEvent(event: any): Promise<void>;
  create(createPullRequestDto: Prisma.PullRequestCreateInput): Promise<PullRequest>;
  findOne(prId: string): Promise<PullRequest>;
  update(prId: string, updatePrDto: Prisma.PullRequestUpdateInput): Promise<PullRequest>;
  remove(prId: string): Promise<PullRequest>;
}

