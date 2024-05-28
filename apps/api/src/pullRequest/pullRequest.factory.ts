import { Injectable, NotFoundException } from '@nestjs/common';
import { PullRequestAdapter } from './pullRequest.adapter';
import { GitProviderConfigService } from 'src/gitProviderConfig/gitProviderConfig.service';
import { GitProviderType } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { GithubPullRequestPort } from './github/githubPullRequest.port';
import { GitlabPullRequestPort } from './gitlab/gitlabPullRequest.port';

@Injectable()
export class PullRequestFactory {
  constructor(
    private readonly gitProviderConfigService: GitProviderConfigService,
    private prisma: PrismaService
  ) {}

  async get(gitProviderConfigId: string): Promise<PullRequestAdapter> {
    const gitProviderConfig = await this.gitProviderConfigService.findById(gitProviderConfigId);

    if (!gitProviderConfig) {
      throw new NotFoundException(
        `No git provider config found for gitProviderConfigId ${gitProviderConfigId}`
      );
    }

    switch (gitProviderConfig.provider) {
      case GitProviderType.GITHUB:
        return new GithubPullRequestPort(this.prisma);
      case GitProviderType.GITLAB:
        return new GitlabPullRequestPort(this.prisma);
      default:
        throw new Error(`Unknown port for ${gitProviderConfig.provider} `);
    }
  }
}
