import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { JWT_SECRET } from 'src/common/configs/constants';
import { UserRepository } from 'src/user/repositories/user.repository';
import { IDecodedToken } from '../interfaces/auth.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly userRepository: UserRepository) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: JWT_SECRET,
    });
  }

  async validate(payload: IDecodedToken) {
    // return { id: payload.sub };
    const user = await this.userRepository.findOne({ _id: payload.sub });
    if (!user) throw new UnauthorizedException('User account does not exist');

    return user;
  }
}
