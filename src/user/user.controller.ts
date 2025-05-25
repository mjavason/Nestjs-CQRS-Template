import {
  Body,
  Controller,
  Get,
  Patch,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { uploadImages } from 'src/common/configs/multer.config';
import { Auth, CurrentUser } from 'src/common/decorators/auth.decorator';
import { MulterFile } from 'src/common/interfaces/multer.interface';
import { UpdateUserDTOWithAvatar } from './dto/update-user.dto';
import { IUserDocument } from './interfaces/user.interface';
import { GetUserProfileQuery } from './queries/get-user-profile/get-user-profile.query';
import { UpdateUserProfileCommand } from './update-user-profile/update-user-profile.command';

@Controller('user')
@ApiTags('User')
export class UserController {
  constructor(
    private readonly queryBus: QueryBus,
    private readonly commandBus: CommandBus,
  ) {}

  @Get('profile')
  @ApiOperation({ summary: 'Retrieve logged in users profile' })
  @Auth()
  async profile(@CurrentUser() auth: IUserDocument) {
    return await this.queryBus.execute(new GetUserProfileQuery(auth.id));
  }

  @Patch()
  @ApiOperation({ summary: 'Update logged in user profile' })
  @UseInterceptors(FileInterceptor('avatar', uploadImages))
  @ApiConsumes('multipart/form-data')
  @Auth()
  async update(
    @UploadedFile() avatar: MulterFile,
    @Body() updateUserDto: UpdateUserDTOWithAvatar,
    @CurrentUser() auth: { id: string },
  ) {
    return await this.commandBus.execute(
      new UpdateUserProfileCommand(auth.id, updateUserDto, avatar),
    );
  }
}
