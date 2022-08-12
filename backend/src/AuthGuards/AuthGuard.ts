import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import * as jwt from 'jsonwebtoken';
import { config } from 'dotenv';
import { UserService } from '../app/user/user.service';
import { User } from '../entity/user.entity';

config();
@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private readonly userService: UserService,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    try {
      const token = request.headers.jwt;
      const decoded = jwt.verify(token.toString(), process.env.JSONSECRET);

      const userId = decoded['id'];
      const user: User = await this.userService.getUser(userId);
      request.user = user;
      return !!user;
    } catch (e) {
      throw new UnauthorizedException();
    }
  }
}
