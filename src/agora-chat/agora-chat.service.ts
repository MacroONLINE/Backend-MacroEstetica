import { Injectable, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class AgoraChatService {
  private readonly apiBaseUrl = process.env.AGORA_CHAT_API_BASE_URL || 'https://a41.chat.agora.io';
  private readonly orgName = process.env.AGORA_CHAT_ORG_NAME || '411307294';
  private readonly appName = process.env.AGORA_CHAT_APP_NAME || '1506986';
  private readonly clientId = process.env.AGORA_CHAT_CLIENT_ID || '';
  private readonly clientSecret = process.env.AGORA_CHAT_CLIENT_SECRET || '';

  private readonly baseUrl = `${this.apiBaseUrl}/${this.orgName}/${this.appName}`;

  async createOrGetUserToken(userId: string) {
    if (!userId) {
      throw new BadRequestException('userId es requerido');
    }

    const appToken = await this.getAppToken();
    await this.ensureUserExists(userId, appToken);
    return this.generateUserToken(userId, appToken);
  }

  private async getAppToken(): Promise<string> {
    try {
      const url = `${this.apiBaseUrl}/${this.orgName}/${this.appName}/token`;
      console.log('Solicitando App Token en:', url);

      const response = await axios.post(url, {
        grant_type: 'client_credentials',
        client_id: this.clientId,
        client_secret: this.clientSecret,
      });

      console.log('App Token recibido:', response.data);
      return response.data?.access_token;
    } catch (error) {
      console.error('Error al obtener App Token:', error.response?.data || error.message);
      throw new InternalServerErrorException(
        `Error al obtener App Token: ${error.response?.data?.error_description || error.message}`,
      );
    }
  }

  private async ensureUserExists(userId: string, appToken: string) {
    try {
      const checkUrl = `${this.baseUrl}/users/${userId}`;
      console.log(`Verificando existencia de usuario ${userId} en ${checkUrl}`);

      await axios.get(checkUrl, {
        headers: { Authorization: `Bearer ${appToken}` },
      });

      console.log(`Usuario ${userId} ya existe en Agora Chat.`);
    } catch (error) {
      if (error.response?.status === 404) {
        console.log(`Usuario ${userId} no encontrado. Creándolo...`);
        await this.createUser(userId, appToken);
      } else {
        console.error(`Error verificando usuario ${userId}:`, error.response?.data || error.message);
        throw new InternalServerErrorException(
          `Error verificando usuario: ${error.response?.data?.error_description || error.message}`,
        );
      }
    }
  }

  private async createUser(userId: string, appToken: string) {
    try {
      const url = `${this.baseUrl}/users`;
      console.log(`Creando usuario ${userId} en ${url}`);

      const response = await axios.post(
        url,
        { username: userId, password: 'Chat12345', nickname: userId },
        { headers: { Authorization: `Bearer ${appToken}` } },
      );

      console.log(`Usuario ${userId} creado con éxito:`, response.data);
    } catch (error) {
      console.error(`Error al crear usuario ${userId}:`, error.response?.data || error.message);
      throw new InternalServerErrorException(
        `Error al crear usuario: ${error.response?.data?.error_description || error.message}`,
      );
    }
  }

  private async generateUserToken(userId: string, appToken: string) {
    try {
      const url = `${this.baseUrl}/users/${userId}/token`;
      console.log(`Generando token para usuario ${userId} en ${url}`);

      const response = await axios.post(
        url,
        { grant_type: 'password' },
        { headers: { Authorization: `Bearer ${appToken}` } },
      );

      console.log(`Token generado para ${userId}:`, response.data);
      return { userId, token: response.data.access_token, expiresIn: response.data.expires_in };
    } catch (error) {
      console.error(`Error al generar token para ${userId}:`, error.response?.data || error.message);
      throw new InternalServerErrorException(
        `Error al generar token: ${error.response?.data?.error_description || error.message}`,
      );
    }
  }
}
