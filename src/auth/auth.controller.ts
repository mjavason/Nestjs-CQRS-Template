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
  /////////////////////////////////////////////

  @Post('reset-password')
  @ApiOperation({ summary: 'Submit new password with verification' })
  async resetPassword(@Body() body: NewPasswordDto) {
    return await this.commandBus.execute(new ResetPasswordCommand(body));
  }

  @Post('login')
  @ApiOperation({
    summary: 'Log in, with jwt tokens',
  })
  @UseGuards(LocalAuthGuard)
  @ApiBody({ type: LoginDTO })
  async login(@Req() req) {
    const user = await this.userRepository.findOne({ _id: req.user.id });
    const accessToken = await this.authService.login(req.user);
    const refreshToken = await this.authService.generateRefreshToken(user.id);

    return {
      message: 'Logged in successfully',
      data: { user, accessToken, refreshToken },
    };
  }

  @Post('request-mail-verification/:email')
  @ApiOperation({
    summary: 'Request an email verification request',
  })
  // @Auth()
  async requestEmailVerification(@Param('email') email: string) {
    await this.authService.requestMailVerification(email.toLowerCase());
    return { message: 'Request sent successfully' };
  }

  @Post('refresh-token')
  @ApiOperation({
    summary: 'Refresh an expired token',
  })
  async refreshToken(@Body() body: RefreshTokenDto) {
    const data = await this.authService.refreshToken(
      body.expiredAccessToken,
      body.refreshToken,
    );
    return { data };
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
    const data = await this.authService.socialSignIn(req.user);
    return res.redirect(
      `${BASE_URL}/api/v1/auth/show-working?registered=true&accessToken=${data.accessToken}&refreshToken=${data.refreshToken}`,
    );
  }

  @Get('show-working')
  async showWorking(@Query() query: unknown) {
    return { data: query };
  }

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
