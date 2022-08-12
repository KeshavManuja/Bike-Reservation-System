import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { UserService } from '../user/user.service';
import { RoleGuard } from '../../AuthGuards/RoleGuard';
import { User } from '../../entity/user.entity';
import { JoiValidationPipe } from '../../joi.validation.pipe';
import {
  LoginUserSchema,
  SignupUserSchema,
  UserUpdateSchema,
} from './user.schema';
import { Auth } from '../../../util/Auth.Decorator';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('signup')
  @UsePipes(new JoiValidationPipe(SignupUserSchema))
  signUp(
    @Body()
    body: {
      email: string;
      password: string;
      name: string;
      role: string;
    },
  ) {
    return this.userService.signupUser(body);
  }

  @Post('login')
  @UsePipes(new JoiValidationPipe(LoginUserSchema))
  loginUser(@Body() body: any) {
    return this.userService.loginUser(body);
  }

  @UseGuards(RoleGuard)
  @Get()
  getUsers(@Query() { page, limit }: { page: string; limit: string }) {
    return this.userService.getUsers(+page, +limit);
  }

  @UseGuards(RoleGuard)
  @Get(':id')
  getUser(@Param('id', ParseIntPipe) id: number) {
    return this.userService.getUser(id);
  }

  @UseGuards(RoleGuard)
  @Post('add')
  @UsePipes(new JoiValidationPipe(SignupUserSchema))
  addUser(@Body() { email, password, name, role }: User) {
    return this.userService.signupUser({ email, password, name, role });
  }

  @UseGuards(RoleGuard)
  @Delete(':id')
  deleteUser(
    @Param('id', ParseIntPipe) id: number,
    @Auth() auth: { user: User; token: string },
  ) {
    return this.userService.deleteUser(id, auth);
  }

  @UseGuards(RoleGuard)
  @Put(':id')
  @UsePipes(new JoiValidationPipe(UserUpdateSchema))
  updateUser(
    @Body() { email, password, name, role }: User,
    @Param() { id }: { id: number },
    @Auth() auth: { user: User; token: string }
  ) {
    return this.userService.updateUser({ email, name, role, id },auth);
  }
}
