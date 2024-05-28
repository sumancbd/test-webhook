import { Injectable } from '@nestjs/common';
import { GitProviderType } from '@prisma/client';
import { AbstractFixture } from 'src/shared/fixture/abstractFixture.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class GitProviderFixture extends AbstractFixture {
  name = GitProviderFixture.name;
  static GITHUB_GIT_PROVIDER_CONFIG = 'GITHUB_GIT_PROVIDER_CONFIG';
  static GITLAB_GIT_PROVIDER_CONFIG = 'GITLAB_GIT_PROVIDER_CONFIG';

  constructor(private readonly prismaService: PrismaService) {
    super();
  }

  async load(): Promise<void> {
    const githubGitProviderConfig = await this.prismaService.gitProvider.create({
      data: {
        webhookSecret: '12345',
        provider: GitProviderType.GITHUB,
      },
    });
    this.addReference(GitProviderFixture.GITHUB_GIT_PROVIDER_CONFIG, githubGitProviderConfig);

    const gitlabGitProviderConfig = await this.prismaService.gitProvider.create({
      data: {
        webhookSecret: '12345',
        provider: GitProviderType.GITLAB,
      },
    });
    this.addReference(GitProviderFixture.GITLAB_GIT_PROVIDER_CONFIG, gitlabGitProviderConfig);
  }
}
