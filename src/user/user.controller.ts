import { Body, Controller, Post } from '@nestjs/common';
import { User } from './interfaces/user.interface';
import { UserService } from './user.service';
import { LogIn } from './dto/login.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async logIn(@Body() logIn: LogIn): Promise<User | { errorMessage: string }> {
    return this.userService.logIn(logIn);
  }
}
