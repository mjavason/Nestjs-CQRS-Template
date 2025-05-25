import { ConflictException } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { AuthService } from 'src/auth/services/auth.service';
import { BucketService } from 'src/bucket/services/bucket.service';
import { generateRandomAvatar } from 'src/common/utils/dicebar.util';
import { UserRepository } from 'src/user/repositories/user.repository';
import { RegisterUserCommand } from './register-user.command';

@CommandHandler(RegisterUserCommand)
export class RegisterUserHandler
  implements ICommandHandler<RegisterUserCommand>
{
  constructor(
    private readonly userRepository: UserRepository,
    private readonly bucketService: BucketService,
    private readonly authService: AuthService,
  ) {}

  async execute(command: RegisterUserCommand) {
    const { body, avatar } = command;

    const emailExists = await this.userRepository.findOne({
      email: body.email,
    });
    if (emailExists) throw new ConflictException('Email already exists');

    if (avatar) {
      const imageUpload = await this.bucketService.uploadToCloudinary(
        avatar.path,
      );
      body.avatarURL = imageUpload.url;
    }

    if (!body.avatarURL) {
      body.avatarURL = generateRandomAvatar(body.email);
    }

    return await this.authService.register(body);
  }
}
