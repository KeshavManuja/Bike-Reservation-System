import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { User } from '../../entity/user.entity';
import * as jwt from 'jsonwebtoken';
import { config } from 'dotenv';
import * as bcrypt from 'bcryptjs';
import { SignupUserSchema, UserUpdateSchema } from './user.schema';
config();

export interface IUser {
  id?: number;
  name: string;
  role: string;
  password: string;
  email: string;
}

export interface Igetuser {
  res: User[];
  pages: number;
}

@Injectable()
export class UserService {
  constructor() {}

  async getUsers(page: number, limit: number): Promise<Igetuser> {
    if (
      !page ||
      page < 1 ||
      !limit ||
      limit < 1 ||
      !Number.isInteger(page) ||
      !Number.isInteger(limit)
    )
      throw new HttpException(
        'Provide valid page or limit',
        HttpStatus.BAD_REQUEST,
      );
    const res = await User.find({
      take: limit,
      skip: (page - 1) * limit,
    });

    if (!res)
      throw new HttpException('Unable to fetch users', HttpStatus.BAD_REQUEST);
    const count = await User.count();

    return { res, pages: Math.ceil(count / limit) };
  }

  async getUser(id: number): Promise<User> {
    const user = await User.findOneBy({ id });
    if (!user) {
      throw new HttpException('User not found', HttpStatus.BAD_REQUEST);
    }
    return user;
  }

  async signupUser(param:any) {
    const { error, value } = SignupUserSchema.validate(param);
    if (error) throw new HttpException(error.message, 400);
    else {
      const salt = bcrypt.genSaltSync(10);
      const hashedPass = bcrypt.hashSync(value.password, salt);

      const existingUser = await User.findOne({
        where: {
          email: value.email.toLowerCase(),
        },
      });

      if (existingUser) {
        throw new HttpException('User already exists.', HttpStatus.BAD_REQUEST);
      }
      const newUser = await User.create({
        ...value,
        password: hashedPass,
        email: value.email.toLowerCase(),
      });
      const { password, ...userDetails } = newUser;
      await User.save(newUser);
      return userDetails;
    }
    
  }

  async loginUser(user: User) {
    const existingUser = await User.createQueryBuilder('user')
      .where('user.email = :email', { email: user.email.toLowerCase() })
      .getOne();

    if (!existingUser) {
      throw new HttpException('User not found', HttpStatus.BAD_REQUEST);
    }

    const matchResult = bcrypt.compareSync(
      user.password,
      existingUser.password,
    );

    if (!matchResult) {
      throw new HttpException(
        "Email & Password combination doesn't exist",
        HttpStatus.BAD_REQUEST,
      );
    }

    const token = jwt.sign({ id: existingUser.id }, process.env.JSONSECRET);
    const { password, ...userDetails } = existingUser;
    return { user: userDetails, token };
  }

  async deleteUser(
    id: number,
    auth: { user: User; token: string },
  ): Promise<void> {
    if (auth.user.id == id) {
      throw new HttpException(
        'Can not delete own account',
        HttpStatus.BAD_REQUEST,
      );
    }
    const user = await User.findOneBy({ id });
    if (!user)
      throw new HttpException('user not found', HttpStatus.BAD_REQUEST);

    await User.delete(id);
  }

  async updateUser(param: {
    name: string;
    email: string;
    role: string;
    id: number;
  },auth: { user: User; token: string }) {
    
    if (auth.user.id == param.id) {
      throw new HttpException(
        'Can not update own account',
        HttpStatus.BAD_REQUEST,
      );
    }
    const { error, value } = UserUpdateSchema.validate(param);
    if (error) throw new HttpException(error.message, 400);
    else {
      const { name, email, role, id } = value;
      const user = await User.findOneBy({ id });
      if (!user) {
        throw new HttpException('user not found', 400);
      }
      if (email && email.toLowerCase() !== user.email) {
        const alreadyUsercheck = await User.findOneBy({
          email: email,
        });
        if (alreadyUsercheck) {
          throw new HttpException(
            'User email is not unique',
            HttpStatus.BAD_REQUEST,
          );
        }
      }

      user.email = email.toLowerCase();
      user.role = role;
      user.name = name;
      const updatedUser = await User.save(user);
      return {
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
      };
    }
  }
}
