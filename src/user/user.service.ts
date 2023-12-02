import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './interfaces/user.interface';
import { LogIn } from './dto/login.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectModel('user')
    private readonly userModel: Model<User>,
  ) {}

  async findByName(name: string): Promise<User> {
    return this.userModel
      .findOne({ name: { $regex: new RegExp(name, 'i') } })
      .exec();
  }

  async logIn({ username }: LogIn): Promise<User | { errorMessage: string }> {
    const userByName: User = await this.findByName(username);

    if (!userByName) {
      const newUser: User = await this.userModel.create({
        name: username,
      });
      return newUser;
    }

    return userByName;
  }
}
