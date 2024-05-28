import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { UtilModule } from './shared/util/util.module';
import { APP_GUARD } from '@nestjs/core';
import { AtGuard } from './auth/guards';
import { JoiPipeModule } from 'nestjs-joi';
import { configOptions } from './config/config';
import { AppConfigModule } from './app-config/app-config.module';
import { joiConfig } from '../config/joi.config';
import { ConsoleModule } from 'nestjs-console';
import { FixturesModule } from './shared/fixture/fixture.module';
import { JwtModule } from '@nestjs/jwt';
import { SeederModule } from './shared/seeder/seeder.module';
import { GitProviderConfigModule } from './gitProviderConfig/gitProviderConfig.module';
import { GithubModule } from './gitProvider/github/github.module';
import { FeedbackModule } from './feedback/feedback.module';
import { PullRequestStatisticModule } from './pullRequestStatistic/pullRequestStatistic.module';
import { CronModule } from './cron/cron.module';
import HealthModule from './health/health.module';

@Module({
  imports: [
    AppConfigModule,
    JoiPipeModule.forRoot(joiConfig),
    ConfigModule.forRoot(configOptions),
    PrismaModule,
    AuthModule,
    UtilModule,
    ConsoleModule,
    FixturesModule,
    JwtModule.register({}),
    SeederModule,
    GitProviderConfigModule,
    GithubModule,
    FeedbackModule,
    PullRequestStatisticModule,
    CronModule,
    HealthModule
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      // All APIs require auth by default. For public APIs decorate it with @Public
      provide: APP_GUARD,
      useClass: AtGuard,
    },
  ],
})
export class AppModule {}
