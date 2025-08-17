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
const cloudinary_service_1 = require("../cloudinary/cloudinary.service");
const client_1 = require("@prisma/client");
const bcrypt = require("bcrypt");
let UsersService = class UsersService {
    constructor(prisma, cloudinary) {
        this.prisma = prisma;
        this.cloudinary = cloudinary;
    }
    normalizeEmpresa(input) {
        const { category, target, userId, ...rest } = input || {};
        const data = { ...rest };
        if (category)
            data.categoria = category;
        if (target)
            data.target = target;
        return data;
    }
    async createUser(data) {
        const payload = { ...data };
        if (!payload.role)
            payload.role = client_1.Role.COSMETOLOGO;
        return this.prisma.user.create({
            data: payload,
            include: { medico: true, empresa: true, instructor: true },
        });
    }
    async updateUser(id, data) {
        return this.prisma.user.update({
            where: { id },
            data: { ...data },
            include: { medico: true, empresa: true, instructor: true },
        });
    }
    async createOrUpdateMedico(userId, dto) {
        return this.prisma.medico.upsert({
            where: { userId },
            update: dto,
            create: { ...dto, userId, verification: dto.verification || '' },
        });
    }
    async createOrUpdateEmpresa(userId, dto) {
        if (!dto.name)
            throw new common_1.HttpException('name required', common_1.HttpStatus.BAD_REQUEST);
        const data = this.normalizeEmpresa(dto);
        if (data.dni) {
            const duplicate = await this.prisma.empresa.findFirst({
                where: { dni: data.dni, userId: { not: userId } },
            });
            if (duplicate)
                throw new common_1.HttpException('DNI already in use', common_1.HttpStatus.CONFLICT);
        }
        const [empresa] = await this.prisma.$transaction([
            this.prisma.empresa.upsert({
                where: { userId },
                update: data,
                create: { ...data, userId },
            }),
            this.prisma.user.update({
                where: { id: userId },
                data: { role: client_1.Role.EMPRESA },
            }),
        ]);
        return empresa;
    }
    async createOrUpdateInstructor(userId, dto) {
        const { userId: _discard, ...data } = dto;
        return this.prisma.instructor.upsert({
            where: { userId },
            update: data,
            create: {
                ...data,
                user: { connect: { id: userId } },
            },
        });
    }
    async updateProfile(userId, dto, file) {
        let uploadedUrl;
        if (file) {
            const uploaded = await this.cloudinary.uploadImage(file);
            uploadedUrl = uploaded.secure_url;
        }
        const { medico, empresa, instructor, ...userFields } = dto;
        await this.prisma.user.update({ where: { id: userId }, data: userFields });
        const user = await this.prisma.user.findUnique({ where: { id: userId } });
        if (!user)
            throw new common_1.HttpException('User not found', common_1.HttpStatus.NOT_FOUND);
        if (medico || user.role === client_1.Role.MEDICO) {
            const medPayload = {
                userId,
                ...(medico ?? {}),
                ...(uploadedUrl ? { verification: uploadedUrl } : {}),
            };
            await this.createOrUpdateMedico(userId, medPayload);
        }
        if (empresa) {
            await this.createOrUpdateEmpresa(userId, empresa);
        }
        if (instructor) {
            await this.createOrUpdateInstructor(userId, instructor);
        }
        return this.findUserById(userId);
    }
    async updateProfileImage(userId, file) {
        const upload = await this.cloudinary.uploadImage(file);
        return this.prisma.user.update({
            where: { id: userId },
            data: { profileImageUrl: upload.secure_url },
        });
    }
    async changePassword(userId, dto) {
        const user = await this.prisma.user.findUnique({ where: { id: userId } });
        if (!user)
            throw new common_1.HttpException('User not found', common_1.HttpStatus.NOT_FOUND);
        const ok = await bcrypt.compare(dto.currentPassword, user.password);
        if (!ok)
            throw new common_1.HttpException('Invalid password', common_1.HttpStatus.FORBIDDEN);
        const hash = await bcrypt.hash(dto.newPassword, 10);
        await this.prisma.user.update({ where: { id: userId }, data: { password: hash } });
        return { message: 'Password updated' };
    }
    async changeEmail(userId, dto) {
        const user = await this.prisma.user.findUnique({ where: { id: userId } });
        if (!user)
            throw new common_1.HttpException('User not found', common_1.HttpStatus.NOT_FOUND);
        const ok = await bcrypt.compare(dto.password, user.password);
        if (!ok)
            throw new common_1.HttpException('Invalid password', common_1.HttpStatus.FORBIDDEN);
        const email = dto.newEmail.trim().toLowerCase();
        const exists = await this.prisma.user.findFirst({ where: { email } });
        if (exists && exists.id !== userId)
            throw new common_1.HttpException('Email already in use', common_1.HttpStatus.CONFLICT);
        await this.prisma.user.update({ where: { id: userId }, data: { email } });
        return { message: 'Email updated' };
    }
    async getMedicoByUserId(userId) {
        return this.prisma.medico.findUnique({ where: { userId } });
    }
    async getEmpresaByUserId(userId) {
        return this.prisma.empresa.findUnique({ where: { userId } });
    }
    async getInstructorByUserId(userId) {
        return this.prisma.instructor.findUnique({ where: { userId } });
    }
    async findUserById(id) {
        return this.prisma.user.findUnique({
            where: { id },
            include: { medico: true, empresa: true, instructor: true },
        });
    }
    async findUserByEmail(email) {
        const e = email.trim().toLowerCase();
        return this.prisma.user.findFirst({
            where: { email: e },
            include: { medico: true, empresa: true, instructor: true },
        });
    }
    async checkUserExistsByEmail(email) {
        const e = email.trim().toLowerCase();
        const user = await this.prisma.user.findFirst({ where: { email: e } });
        if (user) {
            const { password, ...safe } = user;
            return { exists: true, user: safe };
        }
        return { exists: false };
    }
    async checkEmail(email) {
        const user = await this.prisma.user.findUnique({ where: { email } });
        if (!user)
            throw new common_1.NotFoundException('User not found');
        return user;
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        cloudinary_service_1.CloudinaryService])
], UsersService);
//# sourceMappingURL=users.service.js.map