import { CanActivate, ExecutionContext, Injectable, Logger } from '@nestjs/common';
import { Request } from 'express';
import { createHmac } from 'crypto';
import { GitProviderConfigService } from 'src/gitProviderConfig/gitProviderConfig.service';

@Injectable()
export class GitHubWebhookSignatureGuard implements CanActivate {
  logger = new Logger(GitHubWebhookSignatureGuard.name);

  constructor(private readonly gitProviderConfigService: GitProviderConfigService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    try {
      const req = context.switchToHttp().getRequest<Request>();
      const signature: string | string[] = req.headers['x-hub-signature-256'];
      const gitProviderConfigId = req.params.gitProviderConfigId;

      if (!signature) {
        this.logger.log(`This request doesn't contain a github signature ${gitProviderConfigId}`);
      }

      this.logger.log(
        {
          req: JSON.stringify(req?.body || {}),
        },
        `received webhook from github, git provider id: ${gitProviderConfigId}, request body: ${JSON.stringify(
          req?.body || {}
        )}`
      );

      if (!gitProviderConfigId || gitProviderConfigId === '') {
        this.logger.log(`Invalid git provider config ${gitProviderConfigId}`);
        return false;
      }

      const gitProviderConfig = await this.gitProviderConfigService.findById(gitProviderConfigId);
      if (!gitProviderConfig) {
        this.logger.log(`git provider config ${gitProviderConfigId} not found`);
        return false;
      }
      return this.verifySignature(signature, req.body, gitProviderConfig.webhookSecret);
    } catch (error) {
      this.logger.log(error);

      return false;
    }
  }

  private verifySignature(signature: string | string[], payload: any, secret: string): boolean {
    const hmac = createHmac('sha256', secret);
    const digest = 'sha256=' + hmac.update(JSON.stringify(payload)).digest('hex');

    if (!signature || Array.isArray(signature) || signature !== digest) {
      this.logger.log(`Request body digest (${digest}) does not match signature (${signature})`);
      return false;
    }

    return true;
  }
}
