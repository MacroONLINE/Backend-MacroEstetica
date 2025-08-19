import { Controller, Post, Body, UnauthorizedException, BadRequestException, UseGuards, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from '../users/dto/login.dto';
import { ApiTags, ApiOperation, ApiResponse, ApiBody, ApiExtraModels, getSchemaPath } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';

@ApiTags('auth')
@ApiExtraModels(LoginDto)
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: 'User login' })
  @ApiResponse({ status: 200, description: 'Login successful' })
  @ApiResponse({ status: 401, description: 'Invalid credentials' })
  @ApiBody({
    schema: {
      oneOf: [
        { $ref: getSchemaPath(LoginDto) },
        {
          type: 'array',
          minItems: 1,
          maxItems: 1,
          items: { $ref: getSchemaPath(LoginDto) },
        },
      ],
    },
  })
  @Post('login')
  async login(@Body() body: LoginDto | LoginDto[]) {
    const data: any = Array.isArray(body) ? body[0] : body;
    if (!data || typeof data.email !== 'string' || typeof data.password !== 'string') {
      throw new BadRequestException('email and password are required');
    }
    const user = await this.authService.validateUser(data.email, data.password);
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return this.authService.login(user);
  }

  @ApiOperation({ summary: 'Exchange NextAuth token for backend token' })
  @ApiResponse({ status: 200, description: 'Exchange successful' })
  @ApiResponse({ status: 401, description: 'Invalid token' })
  @Post('exchange-nextauth')
  @UseGuards(AuthGuard('nextauth'))
  async exchangeNextAuth(@Req() req: any) {
    const email = req.user?.email;
    if (!email) {
      throw new BadRequestException('email not found in token');
    }
    const user = await this.authService.validateUser(email, '');
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }
    return this.authService.login(user);
  }
}
