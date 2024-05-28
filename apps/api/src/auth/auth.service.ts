import {
  ConflictException,
  ForbiddenException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import {
  LoginDto,
  SignUpDto,
} from './auth.dto';
import { Prisma, User, UserSignupMethod, UserType } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import * as argon from 'argon2';
import { UtilService } from '../shared/util/util.service';
import { JwtService } from '@nestjs/jwt';
import { HttpService } from '@nestjs/axios';
import { JWTTokenType } from './types';
import { catchError, firstValueFrom } from 'rxjs';
import { Profile } from 'passport-google-oauth20';
import { FBProfileJSON } from './types';
import { TUniqueId } from '../shared/types/type';
import { AxiosError } from 'axios';
import { AppConfigService } from '../app-config/app-config.service';

export type JwtPayload = {
  email: string;
  type: UserType;
  sub: string;
};

@Injectable()
export class AuthService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly jwtService: JwtService,
    private readonly httpService: HttpService,
    private readonly appConfigService: AppConfigService,
    private readonly utilService: UtilService
  ) {}

  async getTokens(user: User) {
    const jwtPayload: JwtPayload = {
      sub: user.id,
      email: user.email,
      type: user.type,
    };

    const [at, rt] = await Promise.all([
      this.jwtService.signAsync(
        { ...jwtPayload, tokenType: JWTTokenType.ACCESS },
        {
          secret: this.appConfigService.jwt.atSecret,
          expiresIn: '5m',
        }
      ),
      this.jwtService.signAsync(
        { ...jwtPayload, tokenType: JWTTokenType.REFRESH },
        {
          secret: this.appConfigService.jwt.rtSecret,
          expiresIn: '7d',
        }
      ),
    ]);

    return {
      accessToken: at,
      refreshToken: rt,
    };
  }



  async findEmailRegUserByEmail(email: string) {
    const user = await this.prismaService.user.findFirst({
      where: {
        email,
        deletedAt: {
          isSet: false,
        },
      },
    });
    if (!user) throw new NotFoundException('Invalid credentials');
    return user;
  }

  async loginWithEmailPassword(loginDto: LoginDto) {
    try {
      const user = await this.findEmailRegUserByEmail(loginDto.email);
      if (!user || !user.password) throw new NotFoundException('Invalid credentials');
      
      const isPasswordMatch = await argon.verify(user.password, loginDto.password);
      if (!isPasswordMatch) throw new ForbiddenException('Invalid credentials');

      const tokens = await this.getTokens(user);
      return tokens;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new ForbiddenException('Invalid credentials');
      }

      throw error;
    }
  }

  async me(userFromToken: JwtPayload) {
    const user = await this.prismaService.user.findFirst({
      where: { id: userFromToken.sub, deletedAt: { isSet: false } },
    });
    if (!user) throw new UnauthorizedException('Invalid token');

    delete user.password;
    return user;
  }

  async refreshToken(userFromToken: JwtPayload) {
    const user = await this.prismaService.user.findFirst({ where: { id: userFromToken.sub } });
    return await this.getTokens(user);
  }

  async signUpWithEmail(signUpDto: SignUpDto) {
    await this.checkIfUserExists(signUpDto.email, UserSignupMethod.EMAIL);
    const user = await this.createUser({
      type: UserType.USER,
      signupMethod: UserSignupMethod.EMAIL,
      email: signUpDto.email,
      password: await argon.hash(signUpDto.password),
    });
    delete user.password;

    return user;
  }

  async checkIfUserExists(email: string, signupMethod: UserSignupMethod, ignoreSame = false) {
    const signupMethods = Prisma.dmmf.datamodel.enums
      .find((e) => e.name === 'UserSignupMethod')
      .values.filter((sm) => (ignoreSame ? sm.name !== signupMethod : true))
      .map((sm) => sm.name);

    await Promise.all(
      signupMethods.map(async (sm: UserSignupMethod) => {
        const user = await this.prismaService.user.findFirst({
          where: {
            deletedAt: {
              isSet: false,
            },
            email,
            signupMethod: sm,
          },
        });
        if (user) {
          throw new ConflictException(
            sm === signupMethod
              ? 'User with same email id already exists'
              : 'User already exists with same email address and different signup method!'
          );
        }
      })
    );
  }

  async createUser(data: Prisma.UserCreateInput) {
    return await this.prismaService.user.create({
      data,
    });
  }



  async handleGoogleAuth(idToken: string) {
    const googleUserData = await firstValueFrom(
      this.httpService.get(`https://oauth2.googleapis.com/tokeninfo?id_token=${idToken}`).pipe(
        catchError((error: AxiosError) => {
          throw new ForbiddenException(error.message || 'Access Denied');
        })
      )
    );

    const googleUser = googleUserData.data as Profile['_json'];

    const user = await this.prismaService.user.findFirst({
      where: {
        email: googleUser?.email,
        deletedAt: { isSet: false },
      },
    });

    //If valid registered user exists i.e. if user is logging in, return accessToken
    if (user) {
      if (user.banned === true) throw new UserBannedException();

      return await this.getTokens(user);
    }

    //register new user
    const newUser = await this.createUser({
      type: UserType.USER,
      firstName: googleUser.given_name,
      lastName: googleUser.family_name,
      email: googleUser.email,
      signupMethod: UserSignupMethod.GOOGLE,
      emailVerifiedAt: new Date(),
    });

    //return accessToken for new user
    return await this.getTokens(newUser);
  }

  async handleFbAuth(accessToken: string) {
    const fbUserData = await firstValueFrom(
      this.httpService
        .get(
          `https://graph.facebook.com/v16.0/me?access_token=${accessToken}&fields=first_name,last_name,email`
        )
        .pipe(
          catchError((error: AxiosError) => {
            throw new ForbiddenException(error.message || 'Access Denied');
          })
        )
    );

    if (fbUserData.status >= 400) throw new ForbiddenException('Access Denied');

    const fbUser = fbUserData.data as FBProfileJSON;

    const user = await this.prismaService.user.findFirst({
      where: {
        email: fbUser.email,
        deletedAt: { isSet: false },
      },
    });

    //If valid registered user exists i.e. if user is logging in, return accessToken
    if (user) {
      if (user.banned === true) throw new UserBannedException();

      return await this.getTokens(user);
    }

    //register new user
    const newUser = await this.createUser({
      type: UserType.USER,
      firstName: fbUser.first_name,
      lastName: fbUser.last_name,
      email: fbUser.email,
      signupMethod: UserSignupMethod.FACEBOOK,
      emailVerifiedAt: new Date(),
    });

    //return accessToken for new user
    return await this.getTokens(newUser);
  }

  async getUserById(id: TUniqueId) {
    const user = await this.prismaService.user.findFirst({
      where: { id, deletedAt: { isSet: false } },
    });
    if (!user) throw new NotFoundException('User not found');
    return user;
  }

  async checkIfOtherUserExistsWithSameEmail(email: string, exceptId: TUniqueId) {
    return await this.prismaService.user.findFirst({
      where: {
        id: {
          not: exceptId,
        },
        email,
        deletedAt: {
          isSet: false,
        },
      },
    });
  }

}

export class UserBannedException extends HttpException {
  constructor() {
    super('You have been banned from using the platform', HttpStatus.FORBIDDEN);
  }
}
