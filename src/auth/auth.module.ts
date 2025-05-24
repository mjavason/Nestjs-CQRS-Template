import { Module } from '@nestjs/common';
import { AuthService } from './services/auth.service';
import { AuthController } from './auth.controller';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { LocalStrategy } from './strategy/local.strategy';
import { JwtStrategy } from './strategy/jwt.strategy';
import { UserModule } from 'src/user/user.module';
import { MailModule } from 'src/mail/mail.module';
import { GoogleStrategy } from './strategy/google.strategy';
import { TokenRepository } from './repositories/token.repository';
import { MongooseModule } from '@nestjs/mongoose';
import { Token, tokenSchema } from './entities/token.schema';
import { JWT_SECRET } from 'src/common/configs/constants';

@Module({
  imports: [
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
  ],
  exports: [AuthService],
})
export class AuthModule {}
