import { AuthService } from './auth.service';
import { LoginDto } from '../users/dto/login.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    login(data: LoginDto): Promise<{
        message: string;
        access_token: string;
        user: any;
    }>;
}
