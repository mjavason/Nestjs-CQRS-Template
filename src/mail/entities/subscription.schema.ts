import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { IMailSubscription } from 'src/mail/interfaces/subscription.interface';

@Schema({
  timestamps: true,
  toJSON: {
    virtuals: true,
    transform: (doc, ret) => {
      delete ret._id;
      delete ret.__v;
      return ret;
    },
  },
})
export class MailSubscription implements IMailSubscription {
  @Prop({ required: true, unique: true })
  emailAddress: string;

  @Prop({ default: false })
  verified: boolean;
}

export const mailSubscriptionSchema =
  SchemaFactory.createForClass(MailSubscription);
