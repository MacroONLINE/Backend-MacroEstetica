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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const users_service_1 = require("./users.service");
const bcrypt = require("bcrypt");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const create_user_dto_1 = require("./dto/create-user.dto");
const update_user_dto_1 = require("./dto/update-user.dto");
const update_medico_dto_1 = require("./dto/update-medico.dto");
const update_empresa_dto_1 = require("./dto/update-empresa.dto");
const update_instructor_dto_1 = require("./dto/update-instructor.dto");
const swagger_1 = require("@nestjs/swagger");
const Multer = require("multer");
let UsersController = class UsersController {
    constructor(usersService) {
        this.usersService = usersService;
    }
    async register(userData) {
        const { password, email, role } = userData;
        const existingUser = await this.usersService.findUserByEmail(email);
        if (existingUser) {
            throw new common_1.HttpException('User already exists', common_1.HttpStatus.CONFLICT);
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const userCreateInput = {
            email,
            password: hashedPassword,
            role: role || 'ESTANDAR',
        };
        const newUser = await this.usersService.createUser(userCreateInput);
        return {
            message: 'User created successfully',
            userId: newUser.id,
        };
    }
    async completeProfile(userData, empresaData) {
        try {
            if (!userData.id) {
                throw new common_1.HttpException('User ID is required', common_1.HttpStatus.BAD_REQUEST);
            }
            const { id, role, verification, ...updateData } = userData;
            await this.usersService.updateUser(id, updateData, {
                medicoData: role === 'MEDICO' ? { verification } : undefined,
                empresaData: role === 'EMPRESA' ? empresaData : undefined,
                instructorData: role === 'INSTRUCTOR' ? { profession: userData.bio } : undefined,
            });
            return { message: 'User profile updated successfully' };
        }
        catch (error) {
            throw new common_1.HttpException(error.message || 'Profile update failed', error.status || common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async updateMedico(req, data, file) {
        if (file) {
            data.verification = `https://mockstorage.com/`;
        }
        const userId = req.user.id;
        return this.usersService.updateMedico(userId, data);
    }
    async getMedico(req) {
        const userId = req.user.id;
        return this.usersService.getMedicoByUserId(userId);
    }
    async updateEmpresa(req, data) {
        const userId = req.user.id;
        return this.usersService.updateEmpresa(userId, data);
    }
    async getEmpresa(req) {
        const userId = req.user.id;
        return this.usersService.getEmpresaByUserId(userId);
    }
    async updateInstructor(req, data) {
        const userId = req.user.id;
        return this.usersService.createOrUpdateInstructor(userId, data);
    }
    async getInstructor(req) {
        const userId = req.user.id;
        return this.usersService.getInstructorByUserId(userId);
    }
    async findUserById(id) {
        const user = await this.usersService.findUserById(id);
        if (!user) {
            throw new common_1.HttpException('User not found', common_1.HttpStatus.NOT_FOUND);
        }
        const { password, ...userWithoutPassword } = user;
        return userWithoutPassword;
    }
};
exports.UsersController = UsersController;
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Register a new user (Step 1)' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'User created successfully.' }),
    (0, swagger_1.ApiResponse)({ status: 409, description: 'User already exists.' }),
    (0, common_1.Post)('register'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_user_dto_1.CreateUserDto]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "register", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Complete user profile (Step 2)' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'User profile updated successfully.' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad request.' }),
    (0, common_1.Put)('complete-profile'),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [update_user_dto_1.UpdateUserDto,
        update_empresa_dto_1.UpdateEmpresaDto]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "completeProfile", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Update Medico information with file upload' }),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file')),
    (0, common_1.Put)('medico'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, update_medico_dto_1.UpdateMedicoDto, Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "updateMedico", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Get Medico information' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Medico found.' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Medico not found.' }),
    (0, common_1.Get)('medico'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "getMedico", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Update Empresa information' }),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Put)('empresa'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, update_empresa_dto_1.UpdateEmpresaDto]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "updateEmpresa", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Get Empresa information' }),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Empresa found.' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Empresa not found.' }),
    (0, common_1.Get)('empresa'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "getEmpresa", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Update Instructor information' }),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Put)('instructor'),
    __param(0, (0, common_1.Request)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, update_instructor_dto_1.UpdateInstructorDto]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "updateInstructor", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Get Instructor information' }),
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Instructor found.' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Instructor not found.' }),
    (0, common_1.Get)('instructor'),
    __param(0, (0, common_1.Request)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "getInstructor", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Get user by ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'User found.' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'User not found.' }),
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "findUserById", null);
exports.UsersController = UsersController = __decorate([
    (0, swagger_1.ApiTags)('users'),
    (0, common_1.Controller)('users'),
    __metadata("design:paramtypes", [users_service_1.UsersService])
], UsersController);
//# sourceMappingURL=users.controller.js.map