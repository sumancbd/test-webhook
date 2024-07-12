import { Body, Controller, Post, UsePipes } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { JoiValidationPipe } from 'src/joi-validation-pipe/joi-validation-pipe.interceptor';
import { GitProviderConfigService } from './gitProviderConfig.service';
import { CreateGitProviderConfigDto, createGitProviderConfigSchema } from './gitProviderConfig.dto';

@ApiTags('GitProviderConfig')
@Controller('gitProviderConfig')
export class GitProviderConfigController {
  constructor(private readonly gitProviderConfigService: GitProviderConfigService) {}

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Create git provider config',
  })
  @Post()
  @UsePipes(new JoiValidationPipe(createGitProviderConfigSchema, 'body'))
  create(@Body() gitProviderConfigCreateInput: CreateGitProviderConfigDto) {
    return this.gitProviderConfigService.create(gitProviderConfigCreateInput);
  }
}
