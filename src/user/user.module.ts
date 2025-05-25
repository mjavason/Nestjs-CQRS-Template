import { Module } from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { JwtModule } from '@nestjs/jwt';
import { MongooseModule } from '@nestjs/mongoose';
import { JWT_SECRET } from 'src/common/configs/constants';
import { MailModule } from 'src/mail/mail.module';
import { User, userSchema } from './entities/user.schema';
import { UserRepository } from './repositories/user.repository';
import { UserService } from './services/user.service';
import { UpdateUserProfileHandler } from './update-user-profile/update-user-profile.handler.';
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
  providers: [UserRepository, UserService, , UpdateUserProfileHandler],
  exports: [UserRepository],
})
export class UserModule {}
