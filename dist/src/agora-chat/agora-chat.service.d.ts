export declare class AgoraChatService {
    private readonly apiBaseUrl;
    private readonly orgName;
    private readonly appName;
    private readonly clientId;
    private readonly clientSecret;
    private readonly baseUrl;
    createOrGetUserToken(userId: string): Promise<{
        userId: string;
        token: any;
        expiresIn: any;
    }>;
    private getAppToken;
    private ensureUserExists;
    private createUser;
    private generateUserToken;
}
