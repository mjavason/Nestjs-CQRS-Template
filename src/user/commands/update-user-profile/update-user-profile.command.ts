import { MulterFile } from 'src/common/interfaces/multer.interface';
import { UpdateUserDTOWithAvatar } from '../../dto/update-user.dto';

export class UpdateUserProfileCommand {
  constructor(
    public readonly userId: string,
    public readonly updateDto: UpdateUserDTOWithAvatar,
    public readonly avatar: MulterFile,
  ) {}
}
