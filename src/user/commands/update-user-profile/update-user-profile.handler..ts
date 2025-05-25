import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BucketService } from 'src/bucket/services/bucket.service';
import { IUser } from 'src/user/interfaces/user.interface';
import { UserService } from 'src/user/services/user.service';
import { UpdateUserProfileCommand } from './update-user-profile.command';

@CommandHandler(UpdateUserProfileCommand)
export class UpdateUserProfileHandler
  implements ICommandHandler<UpdateUserProfileCommand>
{
  constructor(
    private readonly bucketService: BucketService,
    private readonly userService: UserService,
  ) {}

  async execute(command: UpdateUserProfileCommand) {
    const { userId, updateDto, avatar } = command;

    const updates: Partial<IUser> = { ...updateDto };

    if (avatar) {
      const uploaded = await this.bucketService.uploadToCloudinary(avatar.path);
      updates.avatarURL = uploaded.url;
    }

    if (updateDto.phoneNumber) updates.isPhoneNumberVerified = false;
    if (updateDto.email || updateDto.password) updates.isEmailVerified = false;

    return await this.userService.updateProfile(userId, updates);
  }
}
