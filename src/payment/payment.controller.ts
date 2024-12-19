import { Controller, Post, Body, Headers, Req, Res, HttpException, HttpStatus } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { ApiTags, ApiOperation, ApiBody, ApiResponse } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { PrismaService } from '../prisma/prisma.service';

@ApiTags('payment')
@Controller('payment')
export class PaymentController {
  constructor(
    private readonly paymentService: PaymentService,
    private readonly prisma: PrismaService, 
  ) {}

  @Post('checkout')
  @ApiOperation({ summary: 'Crea una sesión de checkout de Stripe para un curso' })
  @ApiBody({
    schema: {
      properties: {
        courseId: { type: 'string', description: 'ID del curso' },
        userId: { type: 'string', description: 'ID del usuario' },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Devuelve la URL de la sesión de Stripe.' })
  @ApiResponse({ status: 400, description: 'Error en los parámetros proporcionados.' })
  async createCheckoutSession(@Body('courseId') courseId: string, @Body('userId') userId: string) {
    if (!courseId || !userId) {
      throw new HttpException('courseId and userId are required', HttpStatus.BAD_REQUEST);
    }

    const session = await this.paymentService.createCheckoutSession(courseId, userId);
    return { url: session.url };
  }

  @Post('webhook')
  @ApiOperation({ summary: 'Endpoint para recibir notificaciones de Stripe' })
  @ApiResponse({ status: 200, description: 'Confirma que el webhook fue recibido.' })
  @ApiResponse({ status: 400, description: 'Error al procesar el webhook.' })
  async handleWebhook(
    @Headers('stripe-signature') signature: string,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    if (!signature) {
      return res.status(400).send('Missing stripe-signature header');
    }

    try {
      const result = await this.paymentService.handleWebhookEvent(signature, req['rawBody']);
      res.status(200).send(result);
    } catch (error) {
      console.error('Webhook Error:', error.message);
      res.status(400).send(`Webhook Error: ${error.message}`);
    }
  }

  @Post('enroll')
  @ApiOperation({ summary: 'Registrar la inscripción de un usuario en un curso' })
  @ApiBody({
    schema: {
      properties: {
        courseId: { type: 'string', description: 'ID del curso' },
        userId: { type: 'string', description: 'ID del usuario' },
      },
    },
  })
  @ApiResponse({ status: 201, description: 'Usuario inscrito exitosamente.' })
  @ApiResponse({ status: 400, description: 'Error al registrar la inscripción.' })
  async enrollUser(@Body('courseId') courseId: string, @Body('userId') userId: string) {
    const course = await this.prisma.course.findUnique({ where: { id: courseId } });
    if (!course) {
      throw new HttpException('El curso no existe', HttpStatus.BAD_REQUEST);
    }

    const enrollment = await this.prisma.courseEnrollment.create({
      data: {
        userId,
        courseId,
        enrolledAt: new Date(),
      },
    });

    return { message: 'Inscripción registrada exitosamente', enrollment };
  }
}
