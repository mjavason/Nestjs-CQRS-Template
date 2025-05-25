import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { PassportModule } from '@nestjs/passport';
import { JWT_SECRET } from 'src/common/configs/constants';
import { MailModule } from 'src/mail/mail.module';
import { UserModule } from 'src/user/user.module';
import { AuthController } from './auth.controller';
import { ForgotPasswordHandler } from './commands/forgot-password/forgot-password.handler';
import { GoogleLoginCallbackHandler } from './commands/google-login-callback/google-login-callback.handler';
import { LoginHandler } from './commands/login/login.handler';
import { LogoutHandler } from './commands/logout/logout.handler';
import { RefreshTokenHandler } from './commands/refresh-token/refresh-token.handler';
import { RegisterUserHandler } from './commands/register-user/register-user.handler';
import { RequestEmailVerificationHandler } from './commands/request-email-verification/request-email-verification.handler';
import { ResetPasswordHandler } from './commands/reset-password/reset-password.handler';
import { VerifyEmailHandler } from './commands/verify-email/verify-email.handler';
import { VerifyTokenHandler } from './commands/verify-token/verify-token.handler';
import { Token, tokenSchema } from './entities/token.schema';
import { TokenRepository } from './repositories/token.repository';
import { AuthService } from './services/auth.service';
import { GoogleStrategy } from './strategy/google.strategy';
import { JwtStrategy } from './strategy/jwt.strategy';
import { LocalStrategy } from './strategy/local.strategy';

@Module({
  imports: [
    CqrsModule,
    MailModule,
    UserModule,
    PassportModule,
    MongooseModule.forFeature([{ name: Token.name, schema: tokenSchema }]),
    JwtModule.registerAsync({
      useFactory: () => ({
        secret: JWT_SECRET,
        signOptions: {
          expiresIn: '12h',
        },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    LocalStrategy,
    JwtStrategy,
    GoogleStrategy,
    TokenRepository,
    RegisterUserHandler,
    ForgotPasswordHandler,
    VerifyTokenHandler,
    ResetPasswordHandler,
    LoginHandler,
    RequestEmailVerificationHandler,
    RefreshTokenHandler,
    GoogleLoginCallbackHandler,
    VerifyEmailHandler,
    LogoutHandler,
  ],
  exports: [AuthService],
})
export class AuthModule {}
