import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config'; 
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersService } from './users/users.service';
import { PrismaModule } from './prisma/prisma.module';
import { UsersController } from './users/users.controller';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { CoursesModule } from './courses/courses.module';
import { ProductModule } from './product/products.module';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { PaymentModule } from './payment/payment.module';
import { ResetPasswordModule } from './reset-password/reset-password.module';
import { EmpresaModule } from './empresa/empresa.module';
import { BannerModule } from './banner/banner.module';
import { EventsModule } from './events/events.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }), 
    UsersModule, 
    AuthModule,
    CoursesModule,
    ProductModule,
    CloudinaryModule,
    PaymentModule,
    ResetPasswordModule,
    EmpresaModule,
    BannerModule,
    EventsModule
  ],
  controllers: [AppController, UsersController],
  providers: [AppService, UsersService],
})
export class AppModule {}
