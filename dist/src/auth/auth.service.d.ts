import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
export declare class AuthService {
    private readonly usersService;
    private readonly jwtService;
    constructor(usersService: UsersService, jwtService: JwtService);
    private isAllowAnyPassword;
    validateUser(email: string, pass: string): Promise<any>;
    login(user: any): Promise<{
        message: string;
        access_token: string;
        user: any;
    }>;
}
