import {
  Controller,
  Post,
  Body,
  Param,
  Logger,
  HttpCode,
  HttpStatus,
  BadRequestException,
  Req,
} from '@nestjs/common';
import { ResetPasswordService } from './reset-password.service';

function isEmail(s?: string): boolean {
  if (!s) return false;
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);
}

// Type guard para evitar TS18047 (null es "object" en JS)
function isRecord(x: unknown): x is Record<string, any> {
  return typeof x === 'object' && x !== null;
}

const isProd = process.env.NODE_ENV === 'production';

@Controller('reset-password')
export class ResetPasswordController {
  private readonly logger = new Logger(ResetPasswordController.name);

  constructor(private readonly resetPasswordService: ResetPasswordService) {}

  /**
   * Solicita el envío del email de reset.
   * - Nunca devuelve 500 (evita enumeración de usuarios).
   * - Loguea todo el flujo y retorna data adicional si el service la provee.
   */
  @Post('request')
  @HttpCode(HttpStatus.OK)
  async requestReset(
    @Body('email') email: string,
    @Req() req: any,
  ): Promise<{
    ok: boolean;
    message: string;
    data?: any;
    token?: string;
    error?: { name: string; message: string; stack?: string };
  }> {
    const rid = `${Date.now().toString(36)}-${Math.random()
      .toString(36)
      .slice(2, 8)}`;
    this.logger.log(`[${rid}] POST ${req?.url ?? '/reset-password/request'}`);

    if (!isEmail(email)) {
      this.logger.warn(`[${rid}] email inválido: "${email}"`);
      return {
        ok: true,
        message:
          'Si el correo existe, te enviamos un enlace para restablecer la contraseña.',
      };
    }

    this.logger.log(`[${rid}] solicitando reset para: ${email}`);

    try {
      // Ideal: el service puede devolver:
      //  - objeto { smtpInfo, resetUrl?, token? }
      //  - string token
      //  - null/'' si el usuario no existe (para no enumerar)
      const result = await this.resetPasswordService.generateResetToken(email);

      // Logs útiles si el service devolvió objeto con smtpInfo
      if (isRecord(result) && isRecord(result.smtpInfo)) {
        this.logger.log(
          `[${rid}] email de reset enviado. smtp.response="${
            result.smtpInfo.response ?? 'n/a'
          }" id="${result.smtpInfo.messageId ?? 'n/a'}"`,
        );
      } else {
        this.logger.log(
          `[${rid}] solicitud procesada (posible usuario inexistente o service devolvió token).`,
        );
      }

      // Armar respuesta
      const payload: {
        ok: boolean;
        message: string;
        data?: any;
        token?: string;
      } = {
        ok: true,
        message:
          'Si el correo existe, te enviamos un enlace para restablecer la contraseña.',
      };

      if (isRecord(result)) {
        payload.data = result; // expone lo que devuelva sendMail si lo propagas en el service
      } else if (!isProd && typeof result === 'string') {
        payload.token = result; // solo en no-prod para debug
      }

      return payload;
    } catch (e: any) {
      this.logger.error(
        `[${rid}] error en requestReset: ${e?.message ?? e}`,
        e?.stack,
      );
      // No revelamos errores en prod; en dev los adjuntamos
      return {
        ok: true,
        message:
          'Si el correo existe, te enviamos un enlace para restablecer la contraseña.',
        ...(!isProd
          ? {
              error: {
                name: e?.name ?? 'Error',
                message: e?.message ?? String(e),
                stack: e?.stack,
              },
            }
          : {}),
      };
    }
  }

  /**
   * Cambia la contraseña utilizando el token.
   * - Devuelve 400 si la contraseña no cumple.
   * - Devuelve JSON con ok:true/false y logs.
   */
  @Post('reset/:token')
  async reset(
    @Param('token') token: string,
    @Body('newPassword') newPassword: string,
    @Req() req: any,
  ): Promise<
    | { ok: true; message: string }
    | {
        ok: false;
        message: string;
        error?: { name: string; message: string; stack?: string };
      }
  > {
    const rid = `${Date.now().toString(36)}-${Math.random()
      .toString(36)
      .slice(2, 8)}`;
    this.logger.log(`[${rid}] POST ${req?.url ?? '/reset-password/reset/:token'}`);

    if (!newPassword || newPassword.length < 8) {
      this.logger.warn(
        `[${rid}] newPassword inválido (mínimo 8 chars). length=${newPassword?.length ?? 0}`,
      );
      throw new BadRequestException(
        'La nueva contraseña debe tener al menos 8 caracteres.',
      );
    }

    try {
      await this.resetPasswordService.resetPassword(token, newPassword);
      this.logger.log(`[${rid}] contraseña actualizada correctamente.`);
      return { ok: true, message: 'Contraseña actualizada' };
    } catch (e: any) {
      this.logger.error(
        `[${rid}] error en reset: ${e?.message ?? e}`,
        e?.stack,
      );
      return {
        ok: false,
        message: 'No se pudo actualizar la contraseña',
        ...(!isProd
          ? {
              error: {
                name: e?.name ?? 'Error',
                message: e?.message ?? String(e),
                stack: e?.stack,
              },
            }
          : {}),
      };
    }
  }
}
