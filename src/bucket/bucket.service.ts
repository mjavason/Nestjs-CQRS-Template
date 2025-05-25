import { Injectable, NotFoundException } from '@nestjs/common';
import { cloudinaryInstance } from 'src/common/configs/cloudinary.config';
import { APP_NAME } from 'src/common/configs/constants';
import { BucketRepository } from './bucket.repository';

@Injectable()
export class BucketService {
  constructor(private readonly bucketRepository: BucketRepository) {}

  async uploadToCloudinary(
    path: string,
    folder: string = 'global',
    author: string = '001x',
  ) {
    const imageUpload = await cloudinaryInstance.uploader.upload(path, {
      folder: `${APP_NAME}/${folder}`,
      // resource_type: 'raw',
    });

    return await this.bucketRepository.create({
      author,
      cloudinaryId: imageUpload.public_id,
      url: imageUpload.secure_url,
      metaData: imageUpload,
    });
  }

  async deleteFromCloudinary(url: string, author: string = '001x') {
    const imageUploaded = await this.bucketRepository.findOne({ url, author });
    if (!imageUploaded) throw new NotFoundException('Upload not found');

    await cloudinaryInstance.uploader.destroy(imageUploaded.metaData.public_id);

    return await this.bucketRepository.remove(imageUploaded.id);
  }
}
