import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { AtStrategy, RtStrategy } from './strategies';
import { HttpModule } from '@nestjs/axios';
import { AuthFixture } from './auth.fixture';
import { AuthSeeder } from './auth.seeder';

@Module({
  imports: [JwtModule.register({}), HttpModule],
  providers: [AuthService, AuthSeeder, AtStrategy, RtStrategy, AuthFixture],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
