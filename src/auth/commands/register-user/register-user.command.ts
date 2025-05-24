import { Command } from '@nestjs/cqrs';
import { RegisterWithAvatarDTO } from 'src/auth/dtos/register.dto';
import { MulterFile } from 'src/common/interfaces/multer.interface';

export class RegisterUserCommand extends Command<any> {
  constructor(
    public readonly body: RegisterWithAvatarDTO,
    public readonly avatar: MulterFile,
  ) {
    super();
  }
}
