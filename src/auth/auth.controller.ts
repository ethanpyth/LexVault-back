import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import * as requestWithUserInterface from './interfaces/request-with-user.interface';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  profile(@Req() req: requestWithUserInterface.RequestWithUser) {
    return this.authService.profile(req.user.userId);
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  logout() {
    return {
      message: 'logout succesful',
    };
  }
}
