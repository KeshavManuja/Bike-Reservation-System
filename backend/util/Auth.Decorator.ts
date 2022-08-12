import { createParamDecorator, ExecutionContext } from '@nestjs/common';
export const Auth = createParamDecorator(
  (data: string, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user;
    const token = request.headers.jwt;
    return { user, token };
  },
);
