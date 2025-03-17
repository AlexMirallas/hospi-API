import { Controller, Post, Body, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SignUpDto, SignInDto } from './auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/signup')
  signUp(@Body(ValidationPipe) createUserDto: SignUpDto) {
    return this.authService.signUp(createUserDto);
  }

  @Post('/signin')
  signIn(@Body(ValidationPipe) credentials: SignInDto) {
    return this.authService.signIn(credentials);
  }
}
