import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { UploadApiResponse } from 'cloudinary';
import { IBucket } from 'src/bucket/interfaces/bucket.interface';

@Schema({
  timestamps: true,
  toJSON: {
    virtuals: true,
    transform: function (doc, ret) {
      delete ret._id;
      delete ret.__v;
      return ret;
    },
  },
})
export class Bucket implements IBucket {
  @Prop()
  author: string;

  @Prop({
    required: true,
  })
  url: string;

  @Prop({
    required: true,
  })
  cloudinaryId: string;

  @Prop({
    required: true,
    type: Object,
  })
  metaData: UploadApiResponse;
}

export const bucketSchema = SchemaFactory.createForClass(Bucket);
