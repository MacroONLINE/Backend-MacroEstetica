import { UsersService } from '../users/users.service';
export declare class AuthService {
    private readonly usersService;
    constructor(usersService: UsersService);
    validateUser(email: string, pass: string): Promise<any>;
    login(user: any): Promise<{
        message: string;
        user: any;
    }>;
}
