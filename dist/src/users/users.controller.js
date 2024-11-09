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
const users_service_1 = require("./users.service");
const bcrypt = require("bcrypt");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const create_user_dto_1 = require("./dto/create-user.dto");
const update_medico_dto_1 = require("./dto/update-medico.dto");
const update_empresa_dto_1 = require("./dto/update-empresa.dto");
const swagger_1 = require("@nestjs/swagger");
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
        if (role === 'MEDICO' && !userData.verificacion) {
            throw new common_1.HttpException('Verificacion is required for MEDICO role', common_1.HttpStatus.BAD_REQUEST);
        }
        if (role === 'EMPRESA' && !userData.dni) {
            throw new common_1.HttpException('DNI is required for EMPRESA role', common_1.HttpStatus.BAD_REQUEST);
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const dataObject = Object.assign({}, userData);
        const { verificacion, dni, ...userDataForUser } = dataObject;
        const userCreateInput = {
            ...userDataForUser,
            password: hashedPassword,
        };
        if (role === 'MEDICO') {
            userCreateInput.medico = { create: { verificacion: verificacion } };
        }
        if (role === 'EMPRESA') {
            userCreateInput.empresa = { create: { dni: dni } };
        }
        const user = await this.usersService.createUser(userCreateInput);
        const { password: _, ...userWithoutPassword } = user;
        return { message: 'User created successfully', user: userWithoutPassword };
    }
    async login(loginData) {
        const { email, password } = loginData;
        const user = await this.usersService.findUserByEmail(email);
        if (!user || !(await bcrypt.compare(password, user.password))) {
            throw new common_1.HttpException('Invalid credentials', common_1.HttpStatus.UNAUTHORIZED);
        }
        const { password: _, ...userWithoutPassword } = user;
        return { message: 'Login successful', user: userWithoutPassword };
    }
    async getUserByEmail(email) {
        const user = await this.usersService.findUserByEmail(email);
        if (!user) {
            throw new common_1.HttpException('User not found', common_1.HttpStatus.NOT_FOUND);
        }
        return user;
    }
    async getUserById(id) {
        const user = await this.usersService.findUserById(id);
        if (!user) {
            throw new common_1.HttpException('User not found', common_1.HttpStatus.NOT_FOUND);
        }
        return user;
    }
    async getMedicoByUserId(userId) {
        const medico = await this.usersService.getMedicoByUserId(userId);
        if (!medico) {
            throw new common_1.HttpException('Medico not found', common_1.HttpStatus.NOT_FOUND);
        }
        return medico;
    }
    async updateMedico(userId, data) {
        try {
            const updatedMedico = await this.usersService.updateMedico(userId, data);
            return updatedMedico;
        }
        catch (error) {
            throw new common_1.HttpException('Medico update failed', common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async getEmpresaByUserId(userId) {
        const empresa = await this.usersService.getEmpresaByUserId(userId);
        if (!empresa) {
            throw new common_1.HttpException('Empresa not found', common_1.HttpStatus.NOT_FOUND);
        }
        return empresa;
    }
    async updateEmpresa(userId, data) {
        try {
            const updatedEmpresa = await this.usersService.updateEmpresa(userId, data);
            return updatedEmpresa;
        }
        catch (error) {
            throw new common_1.HttpException('Empresa update failed', common_1.HttpStatus.BAD_REQUEST);
        }
    }
};
exports.UsersController = UsersController;
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Register a new user' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'User created successfully.' }),
    (0, swagger_1.ApiResponse)({ status: 409, description: 'User already exists.' }),
    (0, common_1.Post)('register'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_user_dto_1.CreateUserDto]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "register", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'User login' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Login successful' }),
    (0, swagger_1.ApiResponse)({ status: 401, description: 'Invalid credentials' }),
    (0, common_1.Post)('login'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "login", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiOperation)({ summary: 'Get user by email' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'User found' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'User not found' }),
    (0, common_1.Get)('email/:email'),
    __param(0, (0, common_1.Param)('email')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "getUserByEmail", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiOperation)({ summary: 'Get user by ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'User found' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'User not found' }),
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "getUserById", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiOperation)({ summary: 'Get Medico by user ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Medico found' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Medico not found' }),
    (0, common_1.Get)(':userId/medico'),
    __param(0, (0, common_1.Param)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "getMedicoByUserId", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiOperation)({ summary: 'Update Medico information' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Medico updated successfully' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Medico update failed' }),
    (0, common_1.Put)(':userId/medico'),
    __param(0, (0, common_1.Param)('userId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_medico_dto_1.UpdateMedicoDto]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "updateMedico", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiOperation)({ summary: 'Get Empresa by user ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Empresa found' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Empresa not found' }),
    (0, common_1.Get)(':userId/empresa'),
    __param(0, (0, common_1.Param)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "getEmpresaByUserId", null);
__decorate([
    (0, swagger_1.ApiBearerAuth)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiOperation)({ summary: 'Update Empresa information' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Empresa updated successfully' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Empresa update failed' }),
    (0, common_1.Put)(':userId/empresa'),
    __param(0, (0, common_1.Param)('userId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_empresa_dto_1.UpdateEmpresaDto]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "updateEmpresa", null);
exports.UsersController = UsersController = __decorate([
    (0, swagger_1.ApiTags)('users'),
    (0, common_1.Controller)('users'),
    __metadata("design:paramtypes", [users_service_1.UsersService])
], UsersController);
//# sourceMappingURL=users.controller.js.map