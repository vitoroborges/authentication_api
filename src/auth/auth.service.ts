import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from 'src/module/user/user.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/module/user/entities/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateUser(username: string, password: string): Promise<User> {
    const user = await this.userService.findOne(username);
    if (!bcrypt.compare(password, user.password)) {
      throw new UnauthorizedException();
    }
    return user;
  }

  async signIn(
    username: string,
    pass: string,
  ): Promise<{ access_token: string }> {
    const user = await this.userService.findOne(username);
    if (!bcrypt.compare(pass, user.password)) {
      throw new UnauthorizedException();
    }
    const payload = {
      sub: user.id,
      username: user.username,
    };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
