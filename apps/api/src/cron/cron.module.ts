import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { HttpModule } from '@nestjs/axios';
import { CronService } from './cron.service';
import { AppConfigModule } from 'src/app-config/app-config.module';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    HttpModule,
    AppConfigModule
  ],
  providers: [CronService],
})
export class CronModule {}
