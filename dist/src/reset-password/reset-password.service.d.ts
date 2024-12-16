import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
export declare class ResetPasswordService {
    private readonly prisma;
    private readonly jwtService;
    constructor(prisma: PrismaService, jwtService: JwtService);
    generateResetToken(email: string): Promise<string>;
    resetPassword(token: string, newPassword: string): Promise<void>;
}
