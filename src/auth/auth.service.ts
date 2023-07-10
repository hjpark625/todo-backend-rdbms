import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { Auth } from '@/auth/auth.entity';
import type { Repository } from 'typeorm';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(Auth) private authRepository: Repository<Auth>,
    private jwtService: JwtService,
  ) {}

  async setPassword(password: string) {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    return hashedPassword;
  }

  async checkPassword(user: Auth, password: string) {
    const result = await bcrypt.compare(password, user.hashedPassword);
    return result;
  }

  async findByUserEmail(email: string) {
    const user = await this.authRepository.findOne({ where: { email } });
    return user;
  }

  serialize(user: Auth) {
    const { email, username, registeredAt, updatedAt } = user;
    return {
      email,
      username,
      registeredAt,
      updatedAt,
    };
  }

  async createUser(email: string, username: string, password: string) {
    const user = await this.authRepository.findOne({ where: { email } });
    if (user) {
      throw new HttpException('이미 존재하는 이메일입니다.', HttpStatus.CONFLICT);
    }

    const hashedPassword = await this.setPassword(password);
    const newUser = this.authRepository.create({
      email,
      username: username ?? `${email.split('@')[0]}`,
      hashedPassword,
    });

    await this.authRepository.save(newUser);
    const newUserInfo = await this.authRepository.findOne({ where: { email } });
    const serializedUser = this.serialize(newUserInfo);
    return serializedUser;
  }

  async login(email: string, password: string) {
    const user = await this.authRepository.findOne({ where: { email } });
    if (!user) {
      throw new HttpException('존재하지 않는 유저입니다.', HttpStatus.NOT_FOUND);
    }

    const isMatchPassword = await this.checkPassword(user, password);
    if (!isMatchPassword) {
      throw new HttpException('비밀번호가 일치하지 않습니다.', HttpStatus.UNAUTHORIZED);
    }

    const accessToken = this.generateAccessToken(user);
    const serializedUser = this.serialize(user);

    return { user: serializedUser, access_token: accessToken };
  }

  generateAccessToken(user: Auth) {
    const payload = { userId: user.userId, username: user.username };
    const accessToken = this.jwtService.sign(payload, { expiresIn: '1d' });
    return accessToken;
  }

  async updateUsername(userId: number, newUsername: string) {
    const user = await this.authRepository.findOne({ where: { userId } });
    if (!user) {
      throw new HttpException('존재하지 않는 유저입니다.', HttpStatus.NOT_FOUND);
    }

    const newUserNameData = {
      ...user,
      username: newUsername,
      updatedAt: new Date(Date.now()),
    };

    await this.authRepository.save(newUserNameData);
    return;
  }
}
