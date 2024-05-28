import { ApiProperty } from '@nestjs/swagger';
import { GitProviderType } from '@prisma/client';
import * as Joi from 'joi';

export const createGitProviderSchema = Joi.object({
  provider: Joi.string().valid('GITHUB', 'GITLAB').required(),
  webhookSecret: Joi.string().required(),
});

export class CreateGitProviderDto {
  @ApiProperty({
    example: '123456',
  })
  webhookSecret: string;
  
  @ApiProperty({
    example: 'GITHUB',
    enum: GitProviderType,
    enumName: 'GitProviderType',
  })
  provider: GitProviderType;
}
