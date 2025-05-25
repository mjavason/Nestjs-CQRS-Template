import {
  BadRequestException,
  Controller,
  Delete,
  Param,
  Post,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { AnyFilesInterceptor, FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { upload } from 'src/common/configs/multer.config';
import { Auth, CurrentUser } from 'src/common/decorators/auth.decorator';
import { FileUploadDTO, MultiFileUploadDTO } from 'src/common/dtos/file.dto';
import { MulterFile } from 'src/common/interfaces/multer.interface';
import { IUserDocument } from 'src/user/interfaces/user.interface';
import { DeleteUploadCommand } from './commands/delete-upload/delete-upload.command';
import { UploadFileCommand } from './commands/upload-file/upload-file.handler';
import { UploadMultipleFilesCommand } from './commands/upload-multiple/upload-multiple.command';

@Controller('bucket')
@ApiTags('File Bucket')
export class BucketController {
  constructor(private readonly commandBus: CommandBus) {}

  @Post('upload')
  @ApiOperation({
    summary: 'Upload a file to the platform bucket and cloudinary',
  })
  @UseInterceptors(FileInterceptor('uploadedFile', upload))
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: FileUploadDTO })
  @Auth()
  async uploadFile(
    @UploadedFile() uploadedFile: MulterFile,
    @CurrentUser() auth: IUserDocument,
  ) {
    if (!uploadedFile) throw new BadRequestException('No file uploaded');
    return await this.commandBus.execute(
      new UploadFileCommand(uploadedFile.path, auth.id),
    );
  }

  @Post('upload-multiple')
  @ApiOperation({
    summary: 'Upload a group of files',
    description: 'Maximum of 10 at once',
  })
  @UseInterceptors(AnyFilesInterceptor(upload))
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: MultiFileUploadDTO })
  @Auth()
  async create(
    @UploadedFiles() files: MulterFile[],
    @CurrentUser() auth: IUserDocument,
  ) {
    const filtered = files.filter((file) => file.fieldname === 'uploadedFiles');
    if (filtered.length < 1) throw new BadRequestException('No files uploaded');
    return await this.commandBus.execute(
      new UploadMultipleFilesCommand(filtered, auth.id),
    );
  }

  @Delete('delete-upload/:url')
  @ApiOperation({
    summary: 'Delete a file uploaded to the platform bucket',
    description:
      'This removes the file from the bucket database and from cloudinary itself',
  })
  @Auth()
  async deleteUpload(
    @Param('url') url: string,
    @CurrentUser() auth: IUserDocument,
  ) {
    return await this.commandBus.execute(new DeleteUploadCommand(url, auth.id));
  }
}
