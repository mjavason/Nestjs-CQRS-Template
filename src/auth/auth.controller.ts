import { Auth, CurrentUser } from 'src/common/decorators/auth.decorator';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from 'src/auth/services/auth.service';
import { BASE_URL } from 'src/common/configs/constants';
import { CommandBus } from '@nestjs/cqrs';
import { FileInterceptor } from '@nestjs/platform-express';
import { IDecodedToken } from 'src/auth/interfaces/auth.interface';
import { IUserDocument } from 'src/user/interfaces/user.interface';
import { JwtService } from '@nestjs/jwt';
import { LocalAuthGuard } from 'src/auth/guard/local.guard';
import { MulterFile } from 'src/common/interfaces/multer.interface';
import { RegisterUserCommand } from './commands/register-user/register-user.command';
import { Response } from 'express';
import { TOKEN_TYPE } from 'src/auth/interfaces/token.interface';
import { TokenRepository } from 'src/auth/repositories/token.repository';
import { uploadImages } from 'src/common/configs/multer.config';
import { UserRepository } from 'src/user/repositories/user.repository';
import {
  ApiBody,
  ApiConsumes,
  ApiExcludeEndpoint,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import {
  ForgotPasswordDto,
  RefreshTokenDto,
  VerifyTokenDto,
} from 'src/auth/dtos/token.dto';
import {
  LoginDTO,
  NewPasswordDto,
  RegisterWithAvatarDTO,
} from 'src/auth/dtos/register.dto';
import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  Post,
  Query,
  Req,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { ForgotPasswordCommand } from './commands/forgot-password/forgot-password.command';
import { VerifyTokenCommand } from './commands/verify-token/verify-token.command';
import { ResetPasswordCommand } from './commands/reset-password/reset-password.command';
import { LoginCommand } from './commands/login/login.command';
import { RequestEmailVerificationCommand } from './commands/request-email-verification/request-email-verification.command';
import { RefreshTokenCommand } from './commands/refresh-token/refresh-token.command';
import { GoogleLoginCallbackCommand } from './commands/google-login-callback/google-login-callback.handler';

@Controller('auth')
@ApiTags('Auth')
// @SwaggerResponses()
export class AuthController {
  constructor(
    private authService: AuthService,
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
    private readonly tokenRepository: TokenRepository,
    private readonly commandBus: CommandBus,
  ) {}

  @Post('register')
  @ApiOperation({ summary: 'Sign up' })
  @UseInterceptors(FileInterceptor('avatar', uploadImages))
  @ApiConsumes('multipart/form-data')
  async register(
    @UploadedFile() avatar: MulterFile,
    @Body() body: RegisterWithAvatarDTO,
  ) {
    return await this.commandBus.execute(new RegisterUserCommand(body, avatar));
  }

  @Post('forgot-password/:email')
  @ApiOperation({ summary: 'Request password reset' })
  async forgotPassword(@Param() param: ForgotPasswordDto) {
    return await this.commandBus.execute(
      new ForgotPasswordCommand(param.email),
    );
  }

  @Post('verify-token')
  @ApiOperation({ summary: 'Submit token for verification' })
  async verifyToken(@Query() query: VerifyTokenDto) {
    return await this.commandBus.execute(new VerifyTokenCommand(query));
  }

  @Post('reset-password')
  @ApiOperation({
    summary:
      'After making forgot password request, submit new password with verification',
  })
  async resetPassword(@Body() body: NewPasswordDto) {
    return await this.commandBus.execute(new ResetPasswordCommand(body));
  }

  @Post('login')
  @ApiOperation({ summary: 'Log in, with jwt tokens' })
  @UseGuards(LocalAuthGuard)
  @ApiBody({ type: LoginDTO })
  async login(@Req() req) {
    return await this.commandBus.execute(new LoginCommand(req.user.id));
  }

  @Post('request-mail-verification/:email')
  @ApiOperation({ summary: 'Request an email verification request' })
  async requestEmailVerification(@Param('email') email: string) {
    return await this.commandBus.execute(
      new RequestEmailVerificationCommand(email.toLowerCase()),
    );
  }

  @Post('refresh-token')
  @ApiOperation({ summary: 'Refresh an expired token' })
  async refreshToken(@Body() body: RefreshTokenDto) {
    return await this.commandBus.execute(
      new RefreshTokenCommand(body.expiredAccessToken, body.refreshToken),
    );
  }

  @Get('google')
  @ApiOperation({
    summary: 'Sign in with google',
    description:
      'Call this endpoint from a browser for it to redirect to google server',
  })
  @UseGuards(AuthGuard('google'))
  googleLogin() {}

  @ApiExcludeEndpoint()
  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleLoginCallback(@Req() req, @Res() res: Response) {
    const command = new GoogleLoginCallbackCommand(req.user, res);
    return await this.commandBus.execute(command);
  }

  @Get('show-working')
  async showWorking(@Query() query: unknown) {
    return { data: query };
  }
  /////////////////////////////////////////////

  @Get('verify-email')
  @ApiOperation({ summary: 'Verify user email address' })
  async verifyEmail(@Query('token') token: string) {
    try {
      const payload: IDecodedToken = await this.jwtService.verifyAsync(token);
      await this.userRepository.update(payload.sub, {
        isEmailVerified: true,
      });

      return { message: 'Email verified successfully' };
    } catch (error) {
      // Handle any errors, e.g., invalid token
      Logger.error(error.message);
      throw new BadRequestException('Invalid or expired token');
    }
  }

  @Delete('logout')
  @ApiOperation({ summary: 'Log out and invalidate refresh tokens' })
  @Auth()
  async logout(@CurrentUser() auth: IUserDocument) {
    const token = await this.tokenRepository.findOne({
      user: auth.id,
      type: TOKEN_TYPE.REFRESH_TOKEN,
    });
    if (token) await token.deleteOne();

    return {
      message: 'Logged out successfully! Have a nice day',
    };
  }
}
