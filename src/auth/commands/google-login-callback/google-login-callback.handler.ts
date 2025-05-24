import { Command } from '@nestjs/cqrs';
import { Response } from 'express';

export class GoogleLoginCallbackCommand extends Command<void> {
  constructor(
    public readonly user: any,
    public readonly res: Response,
  ) {
    super();
  }
}
