"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AgoraChatService = void 0;
const common_1 = require("@nestjs/common");
const axios_1 = require("axios");
let AgoraChatService = class AgoraChatService {
    constructor() {
        this.apiBaseUrl = process.env.AGORA_CHAT_API_BASE_URL || 'https://a41.chat.agora.io';
        this.orgName = process.env.AGORA_CHAT_ORG_NAME || '411307294';
        this.appName = process.env.AGORA_CHAT_APP_NAME || '1506986';
        this.clientId = process.env.AGORA_CHAT_CLIENT_ID || '';
        this.clientSecret = process.env.AGORA_CHAT_CLIENT_SECRET || '';
        this.baseUrl = `${this.apiBaseUrl}/${this.orgName}/${this.appName}`;
    }
    async createOrGetUserToken(userId) {
        if (!userId) {
            throw new common_1.BadRequestException('userId es requerido');
        }
        const appToken = await this.getAppToken();
        await this.ensureUserExists(userId, appToken);
        return this.generateUserToken(userId, appToken);
    }
    async getAppToken() {
        try {
            const url = `${this.apiBaseUrl}/${this.orgName}/${this.appName}/token`;
            console.log('Solicitando App Token en:', url);
            const response = await axios_1.default.post(url, {
                grant_type: 'client_credentials',
                client_id: this.clientId,
                client_secret: this.clientSecret,
            });
            console.log('App Token recibido:', response.data);
            return response.data?.access_token;
        }
        catch (error) {
            console.error('Error al obtener App Token:', error.response?.data || error.message);
            throw new common_1.InternalServerErrorException(`Error al obtener App Token: ${error.response?.data?.error_description || error.message}`);
        }
    }
    async ensureUserExists(userId, appToken) {
        try {
            const checkUrl = `${this.baseUrl}/users/${userId}`;
            console.log(`Verificando existencia de usuario ${userId} en ${checkUrl}`);
            await axios_1.default.get(checkUrl, {
                headers: { Authorization: `Bearer ${appToken}` },
            });
            console.log(`Usuario ${userId} ya existe en Agora Chat.`);
        }
        catch (error) {
            if (error.response?.status === 404) {
                console.log(`Usuario ${userId} no encontrado. Creándolo...`);
                await this.createUser(userId, appToken);
            }
            else {
                console.error(`Error verificando usuario ${userId}:`, error.response?.data || error.message);
                throw new common_1.InternalServerErrorException(`Error verificando usuario: ${error.response?.data?.error_description || error.message}`);
            }
        }
    }
    async createUser(userId, appToken) {
        try {
            const url = `${this.baseUrl}/users`;
            console.log(`Creando usuario ${userId} en ${url}`);
            const response = await axios_1.default.post(url, { username: userId, password: 'Chat12345', nickname: userId }, { headers: { Authorization: `Bearer ${appToken}` } });
            console.log(`Usuario ${userId} creado con éxito:`, response.data);
        }
        catch (error) {
            console.error(`Error al crear usuario ${userId}:`, error.response?.data || error.message);
            throw new common_1.InternalServerErrorException(`Error al crear usuario: ${error.response?.data?.error_description || error.message}`);
        }
    }
    async generateUserToken(userId, appToken) {
        try {
            const url = `${this.baseUrl}/users/${userId}/token`;
            console.log(`Generando token para usuario ${userId} en ${url}`);
            const response = await axios_1.default.post(url, { grant_type: 'password' }, { headers: { Authorization: `Bearer ${appToken}` } });
            console.log(`Token generado para ${userId}:`, response.data);
            return { userId, token: response.data.access_token, expiresIn: response.data.expires_in };
        }
        catch (error) {
            console.error(`Error al generar token para ${userId}:`, error.response?.data || error.message);
            throw new common_1.InternalServerErrorException(`Error al generar token: ${error.response?.data?.error_description || error.message}`);
        }
    }
};
exports.AgoraChatService = AgoraChatService;
exports.AgoraChatService = AgoraChatService = __decorate([
    (0, common_1.Injectable)()
], AgoraChatService);
//# sourceMappingURL=agora-chat.service.js.map