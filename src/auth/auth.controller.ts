import { Body, Controller, Get, HttpCode, HttpException, HttpStatus, Param, Patch, Post } from '@nestjs/common';
import { AuthService } from '@/auth/auth.service';
import type { Auth } from '@/auth/auth.entity';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() body: Auth) {
    const { email, password, username } = body;
    try {
      const user = await this.authService.createUser(email, username, password);
      return user;
    } catch (err: unknown) {
      if (err instanceof HttpException) {
        throw new HttpException(err.getResponse(), err.getStatus());
      }
    }
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() body: Auth) {
    const { email, password } = body;
    try {
      const user = await this.authService.login(email, password);
      return user;
    } catch (err: unknown) {
      if (err instanceof HttpException) {
        throw new HttpException(err.getResponse(), err.getStatus());
      }
    }
  }

  @Patch('modify/:userId')
  @HttpCode(HttpStatus.OK)
  async modify(@Body() body: Auth, @Param('userId') userId: number) {
    const { username } = body;
    try {
      const user = await this.authService.updateUsername(userId, username);
      return user;
    } catch (err: unknown) {
      if (err instanceof HttpException) {
        throw new HttpException(err.getResponse(), err.getStatus());
      }
    }
  }
}
