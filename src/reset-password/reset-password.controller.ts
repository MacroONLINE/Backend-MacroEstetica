import { Controller, Post, Body, Param } from '@nestjs/common';
import { ResetPasswordService } from './reset-password.service';

@Controller('reset-password')
export class ResetPasswordController {
  constructor(private readonly resetPasswordService: ResetPasswordService) {}

  @Post('request')
  async requestReset(@Body('email') email: string): Promise<{ message: string }> {
    await this.resetPasswordService.generateResetToken(email);
    return { message: 'Correo de recuperación enviado' };
  }

  @Post('reset/:token')
  async reset(
    @Param('token') token: string,
    @Body('newPassword') newPassword: string,
  ): Promise<{ message: string }> {
    await this.resetPasswordService.resetPassword(token, newPassword);
    return { message: 'Contraseña actualizada' };
  }
}
