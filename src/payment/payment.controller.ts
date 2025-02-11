import {
  Controller,
  Post,
  Body,
  Headers,
  Req,
  Res,
  HttpException,
  HttpStatus,
  Logger
} from '@nestjs/common';
import { PaymentService } from './payment.service';
import { ApiTags, ApiOperation, ApiBody, ApiResponse } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { SubscriptionType } from '@prisma/client';

@ApiTags('payment')
@Controller('payment')
export class PaymentController {
  private readonly logger = new Logger(PaymentController.name);

  constructor(private readonly paymentService: PaymentService) {}

  /**
   * CREA UNA SESIÓN DE CHECKOUT PARA LA COMPRA DE UN CURSO (PAGO ÚNICO)
   */
  @Post('checkout')
  @ApiOperation({ summary: 'Crea una sesión de checkout de Stripe para un curso' })
  @ApiBody({
    schema: {
      properties: {
        courseId: { type: 'string', description: 'ID del curso' },
        userId: { type: 'string', description: 'ID del usuario' },
        email: { type: 'string', description: 'Email del usuario' },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Devuelve la URL de la sesión de Stripe.' })
  @ApiResponse({ status: 400, description: 'Error en los parámetros proporcionados.' })
  async createCheckoutSession(
    @Body('courseId') courseId: string,
    @Body('userId') userId: string,
    @Body('email') email: string,
  ) {
    if (!courseId || !userId || !email) {
      throw new HttpException('courseId, userId y email son requeridos', HttpStatus.BAD_REQUEST);
    }

    const session = await this.paymentService.createCheckoutSession(courseId, userId, email);
    this.logger.log(`Sesión de checkout (curso) creada: ${JSON.stringify(session)}`);
    return { url: session.url };
  }

  /**
   * CREA UNA SESIÓN DE CHECKOUT PARA SUSCRIPCIONES EMPRESARIALES
   */
  @Post('subscription-checkout')
  @ApiOperation({ summary: 'Crea una sesión de checkout de Stripe para suscripciones empresariales' })
  @ApiBody({
    schema: {
      properties: {
        empresaId: { type: 'string', description: 'ID de la empresa' },
        userId: { type: 'string', description: 'ID del usuario' },
        subscriptionType: { type: 'string', description: 'Tipo de suscripción (BASICO, INTERMEDIO, PREMIUM)' },
        email: { type: 'string', description: 'Email del administrador de la empresa' },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Devuelve la URL de la sesión de Stripe.' })
  @ApiResponse({ status: 400, description: 'Error en los parámetros proporcionados.' })
  async createCompanySubscriptionCheckoutSession(
    @Body('empresaId') empresaId: string,
    @Body('userId') userId: string,
    @Body('subscriptionType') subscriptionType: 'BASICO' | 'INTERMEDIO' | 'PREMIUM',
    @Body('email') email: string,
  ) {
    if (!empresaId || !userId || !subscriptionType || !email) {
      throw new HttpException('empresaId, userId, subscriptionType y email son requeridos', HttpStatus.BAD_REQUEST);
    }

    const session = await this.paymentService.createCompanySubscriptionCheckoutSession(
      empresaId,
      userId,
      subscriptionType as SubscriptionType,
      email,
    );
    this.logger.log(
      `Sesión de checkout (suscripción empresa) creada para empresaId: ${empresaId}, userId: ${userId}, tipo: ${subscriptionType}, email: ${email}`,
    );
    return { url: session.url };
  }

  /**
   * CREA UNA SESIÓN DE CHECKOUT PARA LA SUSCRIPCIÓN "update" DE UN USUARIO
   */
  @Post('user-upgrade-checkout')
  @ApiOperation({ summary: 'Crea una sesión de checkout de Stripe para la suscripción "update" de un usuario' })
  @ApiBody({
    schema: {
      properties: {
        userId: { type: 'string', description: 'ID del usuario' },
        email: { type: 'string', description: 'Email del usuario' },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'Devuelve la URL de la sesión de Stripe.' })
  @ApiResponse({ status: 400, description: 'Error en los parámetros proporcionados.' })
  async createUserUpgradeCheckoutSession(
    @Body('userId') userId: string,
    @Body('email') email: string,
  ) {
    if (!userId || !email) {
      throw new HttpException('userId y email son requeridos', HttpStatus.BAD_REQUEST);
    }

    const session = await this.paymentService.createUserUpgradeCheckoutSession(userId, email);
    this.logger.log(
      `Sesión de checkout (usuario update) creada para userId: ${userId}, email: ${email}`,
    );
    return { url: session.url };
  }

  /**
   * ENDPOINT PARA RECIBIR NOTIFICACIONES DE STRIPE (WEBHOOK)
   */
  @Post('webhook')
  @ApiOperation({ summary: 'Endpoint para recibir notificaciones de Stripe' })
  @ApiResponse({ status: 200, description: 'Confirma que el webhook fue recibido.' })
  @ApiResponse({ status: 400, description: 'Error al procesar el webhook.' })
  async handleWebhook(
    @Headers('stripe-signature') signature: string,
    @Req() req: Request,
    @Res() res: Response,
  ) {
    this.logger.log('Webhook recibido en /payment/webhook');

    if (!signature) {
      this.logger.error('Falta el encabezado stripe-signature');
      return res.status(400).send('Falta el encabezado stripe-signature');
    }

    try {
      const result = await this.paymentService.handleWebhookEvent(signature, req['rawBody'] as Buffer);
      this.logger.log('Webhook procesado correctamente');
      res.status(200).send(result);
    } catch (error) {
      this.logger.error(`Error en Webhook: ${error.message}`);
      res.status(400).send(`Error en Webhook: ${error.message}`);
    }
  }

  // ---------------------------------------------------------------------
  // NUEVOS ENDPOINTS PARA PAGAR EVENTOS, WORKSHOPS Y CLASSROOMS
  // ---------------------------------------------------------------------

  @Post('event-checkout')
  @ApiOperation({ summary: 'Crea una sesión de checkout para inscribirse a un Event' })
  @ApiBody({
    schema: {
      properties: {
        eventId: { type: 'string', description: 'ID del Event' },
        userId: { type: 'string', description: 'ID del usuario' },
        email: { type: 'string', description: 'Email del usuario' },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'URL de la sesión de Stripe' })
  @ApiResponse({ status: 400, description: 'Error en parámetros' })
  async createEventCheckoutSession(
    @Body('eventId') eventId: string,
    @Body('userId') userId: string,
    @Body('email') email: string,
  ) {
    if (!eventId || !userId || !email) {
      throw new HttpException('eventId, userId y email son requeridos', HttpStatus.BAD_REQUEST);
    }
    const session = await this.paymentService.createEventCheckoutSession(eventId, userId, email);
    this.logger.log(`Sesión de checkout (evento) creada: ${JSON.stringify(session)}`);
    return { url: session.url };
  }

  @Post('workshop-checkout')
  @ApiOperation({ summary: 'Crea una sesión de checkout para inscribirse a un Workshop' })
  @ApiBody({
    schema: {
      properties: {
        workshopId: { type: 'string', description: 'ID del Workshop' },
        userId: { type: 'string', description: 'ID del usuario' },
        email: { type: 'string', description: 'Email del usuario' },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'URL de la sesión de Stripe' })
  @ApiResponse({ status: 400, description: 'Error en parámetros' })
  async createWorkshopCheckoutSession(
    @Body('workshopId') workshopId: string,
    @Body('userId') userId: string,
    @Body('email') email: string,
  ) {
    if (!workshopId || !userId || !email) {
      throw new HttpException('workshopId, userId y email son requeridos', HttpStatus.BAD_REQUEST);
    }
    const session = await this.paymentService.createWorkshopCheckoutSession(workshopId, userId, email);
    this.logger.log(`Sesión de checkout (workshop) creada: ${JSON.stringify(session)}`);
    return { url: session.url };
  }

  @Post('classroom-checkout')
  @ApiOperation({ summary: 'Crea una sesión de checkout para inscribirse a un Classroom' })
  @ApiBody({
    schema: {
      properties: {
        classroomId: { type: 'string', description: 'ID del Classroom' },
        userId: { type: 'string', description: 'ID del usuario' },
        email: { type: 'string', description: 'Email del usuario' },
      },
    },
  })
  @ApiResponse({ status: 200, description: 'URL de la sesión de Stripe' })
  @ApiResponse({ status: 400, description: 'Error en parámetros' })
  async createClassroomCheckoutSession(
    @Body('classroomId') classroomId: string,
    @Body('userId') userId: string,
    @Body('email') email: string,
  ) {
    if (!classroomId || !userId || !email) {
      throw new HttpException('classroomId, userId y email son requeridos', HttpStatus.BAD_REQUEST);
    }
    const session = await this.paymentService.createClassroomCheckoutSession(classroomId, userId, email);
    this.logger.log(`Sesión de checkout (classroom) creada: ${JSON.stringify(session)}`);
    return { url: session.url };
  }
}
