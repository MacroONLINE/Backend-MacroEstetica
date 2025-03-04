import { AgoraChatService } from './agora-chat.service';
import { CreateUserTokenDto } from './dto/create-user-token.dto';
export declare class AgoraChatController {
    private readonly chatService;
    constructor(chatService: AgoraChatService);
    createOrGetUserToken(body: CreateUserTokenDto): Promise<{
        userId: string;
        token: any;
        expiresIn: any;
    }>;
}
