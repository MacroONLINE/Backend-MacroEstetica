"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const client_1 = require("@prisma/client");
let UsersService = class UsersService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async createUser(data) {
        return this.prisma.user.create({
            data,
            include: {
                medico: true,
                empresa: true,
                instructor: true,
            },
        });
    }
    async updateUser(id, data) {
        const updatedData = {
            ...data,
            role: client_1.Role.COSMETOLOGO,
        };
        return this.prisma.user.update({
            where: { id },
            data: updatedData,
            include: {
                medico: true,
                empresa: true,
                instructor: true,
            },
        });
    }
    async createOrUpdateMedico(userId, data) {
        const createData = {
            userId,
            verification: data.verification || '',
        };
        return this.prisma.medico.upsert({
            where: { userId },
            update: {
                ...data,
            },
            create: createData,
        });
    }
    async createOrUpdateEmpresa(userId, data) {
        if (!data.name) {
            throw new Error("El campo 'name' es obligatorio.");
        }
        if (data.dni) {
            const existing = await this.prisma.empresa.findFirst({
                where: {
                    dni: data.dni,
                },
            });
            if (existing) {
                throw new common_1.HttpException('Registro duplicado: El DNI ya está en uso.', common_1.HttpStatus.CONFLICT);
            }
        }
        const updateData = {
            name: data.name,
            giro: data.giro || 'EMPRESA_PROFESIONAL_PERFIL',
            subscription: data.subscription,
            webUrl: data.webUrl,
            updatedAt: new Date(),
            bannerImage: data.bannerImage,
            logo: data.logo,
            title: data.title,
            profileImage: data.profileImage,
            ceo: data.ceo,
            ceoRole: data.ceoRole,
            location: data.location,
            followers: data.followers,
            dni: data.dni,
        };
        const createData = {
            userId,
            name: data.name,
            giro: data.giro || 'EMPRESA_PROFESIONAL_PERFIL',
            subscription: data.subscription,
            webUrl: data.webUrl,
            createdAt: new Date(),
            updatedAt: new Date(),
            bannerImage: data.bannerImage,
            logo: data.logo,
            title: data.title,
            profileImage: data.profileImage,
            ceo: data.ceo,
            ceoRole: data.ceoRole,
            location: data.location,
            followers: data.followers,
            dni: data.dni,
        };
        return this.prisma.empresa.upsert({
            where: { userId },
            update: updateData,
            create: createData,
        });
    }
    async createOrUpdateInstructor(userId, data) {
        return this.prisma.instructor.upsert({
            where: { userId },
            update: data,
            create: {
                ...data,
                userId,
            },
        });
    }
    async getMedicoByUserId(userId) {
        return this.prisma.medico.findUnique({
            where: { userId },
        });
    }
    async getEmpresaByUserId(userId) {
        return this.prisma.empresa.findUnique({
            where: { userId },
        });
    }
    async getInstructorByUserId(userId) {
        return this.prisma.instructor.findUnique({
            where: { userId },
        });
    }
    async findUserById(id) {
        return this.prisma.user.findUnique({
            where: { id },
            include: {
                medico: true,
                empresa: true,
                instructor: true,
            },
        });
    }
    async findUserByEmail(email) {
        const standardizedEmail = email.trim().toLowerCase();
        return this.prisma.user.findFirst({
            where: { email: standardizedEmail },
            include: {
                medico: true,
                empresa: true,
                instructor: true,
            },
        });
    }
    async checkUserExistsByEmail(email) {
        const standardizedEmail = email.trim().toLowerCase();
        const debugInfo = {
            receivedEmail: email,
            standardizedEmail: standardizedEmail,
            prismaResult: null,
        };
        const user = await this.prisma.user.findFirst({
            where: { email: standardizedEmail },
        });
        debugInfo.prismaResult = user;
        if (user) {
            const { password, ...userWithoutPassword } = user;
            return {
                exists: true,
                user: userWithoutPassword,
                debugInfo,
            };
        }
        else {
            return {
                exists: false,
                debugInfo: {
                    ...debugInfo,
                    message: `User not found for email: ${standardizedEmail}`,
                },
            };
        }
    }
    async checkEmail(email) {
        const user = await this.prisma.user.findUnique({
            where: { email },
        });
        if (!user) {
            throw new common_1.NotFoundException('User not found');
        }
        return user;
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], UsersService);
//# sourceMappingURL=users.service.js.map