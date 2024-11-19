import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config'; // Importa ConfigModule
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersService } from './users/users.service';
import { PrismaModule } from './prisma/prisma.module';
import { UsersController } from './users/users.controller';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { CoursesModule } from './courses/courses.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }), // Agrega el ConfigModule y habilítalo globalmente
    PrismaModule, 
    UsersModule, 
    AuthModule,
    CoursesModule
  ],
  controllers: [AppController, UsersController],
  providers: [AppService, UsersService],
})
export class AppModule {}
