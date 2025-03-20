import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { User } from '../users/user.entity';
import * as bcrypt from 'bcrypt';
import { SignUpDto, SignInDto } from './auth.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  async signUp(createUserDto: SignUpDto): Promise<{ token: string }> {
    const { email, password, firstName, lastName } = createUserDto;

    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = this.userRepository.create({
      email,
      password: hashedPassword,
      firstName,
      lastName,
      role: ['user'],
    });

    try {
      await this.userRepository.save(user);
      const token = this.jwtService.sign({ userId: user.id , role: user.role });
      return { token };
    } catch (error) {
      if (error.code === '23505') {
        throw new UnauthorizedException('Email already exists');
      }
      throw error;
    }
  }

  async signIn(credentials: SignInDto): Promise<{ token: string, role: string[]}> {
    const { email, password } = credentials;
    const user = await this.userRepository.findOne({ where: { email } });

    if (user && (await bcrypt.compare(password, user.password))) {
      const token = this.jwtService.sign({ userId: user.id , role: user.role });
      return { token,  role: user.role };
    }
    throw new UnauthorizedException('Invalid credentials');
  }
}
