import { Body, Controller, Get, HttpCode, HttpStatus, Post, Put, UnauthorizedException, UseGuards } from '@nestjs/common';
import { ChangePasswordDTO, ForgotPasswordDTO, ResetPasswordDTO, SignInDTO, SignUpDTO } from './auth.dto';
import { AuthService } from './auth.service';
import { UsersService } from '../users/users.service';
import { AuthGuard } from '@nestjs/passport';
import { AuthenticatedUser } from 'src/common/decorators/authenticated-user.decorator';
import type { User } from '@prisma/client';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth/jwt-auth.guard';
import { ApiBearerAuth } from '@nestjs/swagger';

@Controller({
  version: '1',
  path: 'auth',
})
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) { }

  @Post('signup')
  signup(@Body() data: SignUpDTO) {
    return this.authService.signup(data)
  }

  @Post('signin')
  @HttpCode(HttpStatus.OK)
  signin(@Body() data: SignInDTO) {
    return this.authService.signin(data)
  }

  @Get('me')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('jwt')
  async me(@AuthenticatedUser() user: User) {
    const userData = await this.usersService.findById(user.id)
    if (!userData) {
      throw new UnauthorizedException('User not found')
    }

    return {
      id: userData.id,
      name: userData.name,
      avatar: userData.avatar,
      email: userData.email,
      createdAt: userData.createdAt,
      updatedAt: userData.updatedAt
    }
  }

  @Post('forgot-password')
  forgotPassword(@Body() data: ForgotPasswordDTO) {
    return this.authService.forgotPassword(data.email)
  }

  @Post('reset-password')
  resetPassword(@Body() data: ResetPasswordDTO) {
    return this.authService.resetPassword(data.token, data.newPassword)
  }

  @Put('change-password')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth('jwt')
  async changePassword(@AuthenticatedUser() user: User, @Body() data: ChangePasswordDTO) {
    await this.authService.changePassword(user.id, data)
    return { message: 'Password changed successfully' }
  }

}
