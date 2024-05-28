import { Injectable, NotFoundException } from '@nestjs/common';
import { GitProviderConfigService } from 'src/gitProviderConfig/gitProviderConfig.service';
import { GitProviderType } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { GithubFeedbackPort } from './github/githubFeedback.port';
import { FeedbackAdapter } from './feedback.adapter';
import { GitlabFeedbackPort } from './gitlab/gitlabFeedback.port';
import { PullRequestFactory } from 'src/pullRequest/pullRequest.factory';
import { GithubPullRequestPort } from 'src/pullRequest/github/githubPullRequest.port';

@Injectable()
export class FeedbackFactory {
  constructor(
    private readonly gitProviderConfigService: GitProviderConfigService,
    private prisma: PrismaService,
    private pullRequestFactory: PullRequestFactory
  ) {}

  async get(gitProviderConfigId: string): Promise<FeedbackAdapter> {
    const gitProviderConfig = await this.gitProviderConfigService.findById(gitProviderConfigId);

    if (!gitProviderConfig) {
      throw new NotFoundException(
        `No git provider config found for gitProviderConfigId ${gitProviderConfigId}`
      );
    }

    switch (gitProviderConfig.provider) {
      case GitProviderType.GITHUB:
        return await this.getGithubFeedbackPort(gitProviderConfigId);
      case GitProviderType.GITLAB:
        return new GitlabFeedbackPort(this.prisma);
      default:
        throw new Error(`Unknown port for ${gitProviderConfig.provider} `);
    }
  }

  private async getGithubFeedbackPort(gitProviderConfigId: string) {
    const port = await this.pullRequestFactory.get(gitProviderConfigId);

    return new GithubFeedbackPort(this.prisma, port as GithubPullRequestPort);
  }
}
