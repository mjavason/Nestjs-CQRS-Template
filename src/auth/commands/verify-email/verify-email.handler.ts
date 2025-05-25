import { BadRequestException, Logger } from '@nestjs/common';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { JwtService } from '@nestjs/jwt';
import { IDecodedToken } from 'src/auth/interfaces/auth.interface';
import { UserRepository } from 'src/user/repositories/user.repository';
import { VerifyEmailCommand } from './verify-email.command';

@CommandHandler(VerifyEmailCommand)
export class VerifyEmailHandler implements ICommandHandler<VerifyEmailCommand> {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userRepository: UserRepository,
  ) {}

  async execute(command: VerifyEmailCommand) {
    try {
      const payload: IDecodedToken = await this.jwtService.verifyAsync(
        command.token,
      );
      await this.userRepository.update(payload.sub, {
        isEmailVerified: true,
      });
    } catch (error) {
      Logger.error(error.message);
      throw new BadRequestException('Invalid or expired token');
    }
  }
}
