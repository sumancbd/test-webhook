import {
  Body,
  Controller,
  Get,
  Post,
  Query,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UtilService } from '../shared/util/util.service';
import { tokenSchema, LoginDto, loginSchema, SignUpDto, signupSchema } from './auth.dto';
import { AuthService, JwtPayload } from './auth.service';
import { GetCurrentUser, Public } from './decorators';
import { Refresh } from './decorators/refresh.decorator';
import { RtGuard } from './guards';
import { JoiValidationPipe } from '../joi-validation-pipe/joi-validation-pipe.interceptor';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Public()
  @ApiOperation({
    summary: 'Register with unique email',
  })
  @Post('register/email')
  @UsePipes(new JoiValidationPipe(signupSchema, 'body'))
  async signUpWithEmail(@Body() signUpDto: SignUpDto) {
    const user = await this.authService.signUpWithEmail(signUpDto);
    return UtilService.buildResponse({ user });
  }

  @Public()
  @ApiOperation({
    summary: 'Login with email and password',
  })
  @Post('login/email')
  @UsePipes(new JoiValidationPipe(loginSchema, 'body'))
  async loginWithEmailPassword(@Body() loginDto: LoginDto) {
    const tokens = await this.authService.loginWithEmailPassword(loginDto);
    return UtilService.buildResponse({ tokens });
  }

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Refresh token',
  })
  @Refresh()
  @Get('refresh')
  @UseGuards(RtGuard)
  async refresh(@GetCurrentUser() userFromToken: JwtPayload) {
    const tokens = await this.authService.refreshToken(userFromToken);

    return UtilService.buildResponse({ tokens });
  }

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'return logged in user details',
  })
  @Get('/me')
  async me(@GetCurrentUser() userFromToken: JwtPayload) {
    const user = await this.authService.me(userFromToken);
    return UtilService.buildResponse({ user });
  }

  @Public()
  @ApiOperation({
    summary:
      'Call this url with id_token to generate token after successful authentication by google internally',
  })
  @Get('google')
  @UsePipes(new JoiValidationPipe(tokenSchema, 'query'))
  async googleAuth(@Query('id_token') idToken: string) {
    const tokens = await this.authService.handleGoogleAuth(idToken);
    return UtilService.buildResponse({ tokens });
  }

  @Public()
  @ApiOperation({
    summary:
      'Call this url with fb access_token to generate token after successful authentication by facebook internally',
  })
  @Get('facebook')
  @UsePipes(new JoiValidationPipe(tokenSchema, 'query'))
  async fbAuth(@Query('access_token') accessToken: string) {
    const tokens = await this.authService.handleFbAuth(accessToken);
    return UtilService.buildResponse({ tokens });
  }
}
