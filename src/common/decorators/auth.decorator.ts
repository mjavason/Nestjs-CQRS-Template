import {
  ExecutionContext,
  SetMetadata,
  UseGuards,
  applyDecorators,
  createParamDecorator,
} from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guard/jwt.guard';
import { RolesGuard } from 'src/auth/guard/role.guard';
import { USER_ROLES, USER_TYPES } from 'src/user/interfaces/user.interface';

export function Auth(
  USER_ROLES: USER_ROLES[] = [],
  USER_TYPE?: USER_TYPES,
): MethodDecorator {
  return applyDecorators(
    UseGuards(JwtAuthGuard),
    SetMetadata('USER_ROLES', USER_ROLES),
    SetMetadata('USER_TYPES', USER_TYPE),
    UseGuards(RolesGuard),
    ApiBadRequestResponse({
      description: 'Bad request',
    }),
    ApiUnauthorizedResponse({
      description: 'Unauthorized',
    }),
    ApiForbiddenResponse({ description: 'forbidden' }),
    ApiBearerAuth(),
  );
}

export const CurrentUser = createParamDecorator(
  (data, ctx: ExecutionContext) => {
    const { user } = ctx.switchToHttp().getRequest();

    return user;
  },
);
