import { ConflictException, Injectable } from '@nestjs/common';
import { GitProvider, GitProviderType } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateGitProviderDto } from './gitProviderConfig.dto';

@Injectable()
export class GitProviderConfigService {
  constructor(private readonly prismaService: PrismaService) {}

  async create(input: CreateGitProviderDto): Promise<GitProvider> {
    const existingConfig = await this.findByGitProviderType(input.provider);

    if (existingConfig) {
      throw new ConflictException(`Git provider config for ${input.provider} already exist`);
    }

    const paymentProviderConfig = await this.prismaService.gitProvider.create({
      data: {
        provider: input.provider,
        webhookSecret: input.webhookSecret,
      },
    });

    return paymentProviderConfig;
  }

  async findById(id: string): Promise<GitProvider> {
    return this.prismaService.gitProvider.findFirst({
      where: {
        id,
      },
    });
  }

  async findByGitProviderType(provider: GitProviderType): Promise<GitProvider> {
    return await this.prismaService.gitProvider.findFirst({
      where: {
        provider: provider,
      },
    });
  }

  async deleteById(id: string): Promise<boolean> {
    const gitProviderConfig = await this.findById(id);
    if (!gitProviderConfig) {
      return false;
    }

    await this.prismaService.gitProvider.delete({ where: { id } });
    return true;
  }
}
