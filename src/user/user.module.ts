import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { JWT_SECRET } from 'src/common/configs/constants';
import { MailModule } from 'src/mail/mail.module';
import { User, userSchema } from './entities/user.schema';
import { GetUserProfileHandler } from './queries/get-user-profile/get-user-profile.handler';
import { UserRepository } from './repositories/user.repository';
import { UserService } from './services/user.service';
import { UserController } from './user.controller';

@Module({
  imports: [
    CqrsModule,
    MongooseModule.forFeature([{ name: User.name, schema: userSchema }]),
    MailModule,
    JwtModule.registerAsync({
      useFactory: () => ({
        secret: JWT_SECRET,
        signOptions: {
          expiresIn: '60m',
        },
      }),
    }),
  ],
  controllers: [UserController],
  providers: [UserRepository, UserService, GetUserProfileHandler],
  exports: [UserRepository],
})
export class UserModule {}
