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
    async updateUser(id, data, roleData) {
        const { medicoData, empresaData, instructorData } = roleData || {};
        const user = await this.prisma.user.update({
            where: { id },
            data,
            include: {
                medico: true,
                empresa: true,
                instructor: true,
            },
        });
        if (medicoData) {
            await this.createOrUpdateMedico(id, medicoData);
        }
        else if (empresaData) {
            await this.createOrUpdateEmpresa(id, empresaData);
        }
        else if (instructorData) {
            await this.createOrUpdateInstructor(id, instructorData);
        }
        return user;
    }
    async createOrUpdateMedico(userId, data) {
        return this.prisma.medico.upsert({
            where: { userId },
            update: data,
            create: {
                ...data,
                userId,
            },
        });
    }
    async createOrUpdateEmpresa(userId, data) {
        return this.prisma.empresa.upsert({
            where: { userId },
            update: data,
            create: {
                ...data,
                userId,
            },
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
    async updateMedico(userId, data) {
        return this.prisma.medico.update({
            where: { userId },
            data,
        });
    }
    async updateEmpresa(userId, data) {
        return this.prisma.empresa.update({
            where: { userId },
            data,
        });
    }
    async updateInstructor(userId, data) {
        return this.prisma.instructor.update({
            where: { userId },
            data,
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
    async findUserByEmail(email) {
        return this.prisma.user.findUnique({
            where: { email },
            include: {
                medico: true,
                empresa: true,
                instructor: true,
            },
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
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], UsersService);
//# sourceMappingURL=users.service.js.map