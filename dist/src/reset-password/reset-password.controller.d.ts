import { ResetPasswordService } from './reset-password.service';
export declare class ResetPasswordController {
    private readonly resetPasswordService;
    private readonly logger;
    constructor(resetPasswordService: ResetPasswordService);
    requestReset(email: string, req: any): Promise<{
        ok: boolean;
        message: string;
        data?: any;
        token?: string;
        error?: {
            name: string;
            message: string;
            stack?: string;
        };
    }>;
    reset(token: string, newPassword: string, req: any): Promise<{
        ok: true;
        message: string;
    } | {
        ok: false;
        message: string;
        error?: {
            name: string;
            message: string;
            stack?: string;
        };
    }>;
}
