import { ResetPasswordService } from './reset-password.service';
export declare class ResetPasswordController {
    private readonly resetPasswordService;
    constructor(resetPasswordService: ResetPasswordService);
    requestReset(email: string): Promise<{
        message: string;
    }>;
    reset(token: string, newPassword: string): Promise<{
        message: string;
    }>;
}
