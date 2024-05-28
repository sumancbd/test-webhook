import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppConfigService {
  constructor(private readonly configService: ConfigService) {}

  readonly app = {
    port: this.configService.get<number>('APP_PORT'),
    host: this.configService.get<string>('APP_HOST'),
    name: this.configService.get<string>('APP_NAME'),
  };

  readonly db = {
    url: this.configService.get<string>('DATABASE_URL'),
  };

  readonly jwt = {
    atSecret: this.configService.get<string>('AT_SECRET'),
    rtSecret: this.configService.get<string>('RT_SECRET'),
  };

  readonly slack = {
    url: this.configService.get<string>('SLACK_URL')
  };


}
