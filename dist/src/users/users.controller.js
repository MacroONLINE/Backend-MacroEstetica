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
var UsersController_1;
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
const cloudinary_service_1 = require("../cloudinary/cloudinary.service");
let UsersController = UsersController_1 = class UsersController {
    constructor(usersService, cloudinaryService) {
        this.usersService = usersService;
        this.cloudinaryService = cloudinaryService;
        this.logger = new common_1.Logger(UsersController_1.name);
    }
    async checkUserByEmail(email) {
        this.logger.debug(`checkUserByEmail => email: ${email}`);
        console.log('checkUserByEmail => email:', email);
        if (!email) {
            this.logger.error('Email is required');
            throw new common_1.HttpException('Email is required', common_1.HttpStatus.BAD_REQUEST);
        }
        try {
            const result = await this.usersService.checkUserExistsByEmail(email);
            this.logger.debug(`checkUserByEmail => Result: ${JSON.stringify(result)}`);
            console.log('checkUserByEmail => Result:', result);
            return result;
        }
        catch (err) {
            this.logger.error(`Error in checkUserByEmail => ${err.message}`);
            throw err;
        }
    }
    async register(userData) {
        this.logger.debug(`register => body: ${JSON.stringify(userData)}`);
        console.log('register => body:', userData);
        const { password, email, role } = userData;
        try {
            const existingUser = await this.usersService.findUserByEmail(email);
            if (existingUser) {
                this.logger.error('User already exists');
                throw new common_1.HttpException('User already exists', common_1.HttpStatus.CONFLICT);
            }
            const hashedPassword = await bcrypt.hash(password, 10);
            const userCreateInput = {
                email,
                password: hashedPassword,
                role: role || 'ESTANDAR',
            };
            this.logger.debug(`register => userCreateInput: ${JSON.stringify(userCreateInput)}`);
            console.log('register => userCreateInput:', userCreateInput);
            const newUser = await this.usersService.createUser(userCreateInput);
            this.logger.debug(`register => newUser: ${JSON.stringify(newUser)}`);
            console.log('register => newUser:', newUser);
            return {
                message: 'User created successfully',
                userId: newUser.id,
            };
        }
        catch (err) {
            this.logger.error(`Error in register => ${err.message}`);
            throw err;
        }
    }
    async completeProfile(userData) {
        this.logger.debug(`completeProfile => body: ${JSON.stringify(userData)}`);
        console.log('completeProfile => body:', userData);
        try {
            if (!userData.id) {
                this.logger.error('User ID is required in completeProfile');
                throw new common_1.HttpException('User ID is required', common_1.HttpStatus.BAD_REQUEST);
            }
            const { id, role, ...updateData } = userData;
            this.logger.debug(`completeProfile => updateData: ${JSON.stringify(updateData)}`);
            console.log('completeProfile => updateData:', updateData);
            await this.usersService.updateUser(id, updateData);
            return { message: 'User profile updated successfully' };
        }
        catch (error) {
            this.logger.error(`Error in completeProfile => ${error.message}`);
            throw new common_1.HttpException(error.message || 'Profile update failed', error.status || common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async updateMedico(req, file, data) {
        this.logger.debug(`updateMedico => Request headers: ${JSON.stringify(req.headers)}`);
        console.log('updateMedico => Request headers:', req.headers);
        this.logger.debug(`updateMedico => body: ${JSON.stringify(data)}`);
        console.log('updateMedico => body:', data);
        this.logger.debug(`updateMedico => file: ${JSON.stringify(file)}`);
        console.log('updateMedico => file:', file);
        if (!data.userId) {
            this.logger.error('User ID is required in updateMedico');
            throw new common_1.HttpException('User ID is required', common_1.HttpStatus.BAD_REQUEST);
        }
        if (file) {
            try {
                const uploadResult = await this.cloudinaryService.uploadImage(file);
                this.logger.debug(`updateMedico => uploadResult: ${JSON.stringify(uploadResult)}`);
                console.log('updateMedico => uploadResult:', uploadResult);
                data.verification = uploadResult.secure_url;
            }
            catch (error) {
                this.logger.error(`Error uploading file => ${error.message}`);
                throw new common_1.HttpException('Error al subir el archivo', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
            }
        }
        try {
            const result = await this.usersService.createOrUpdateMedico(data.userId, data);
            this.logger.debug(`updateMedico => result: ${JSON.stringify(result)}`);
            console.log('updateMedico => result:', result);
            return result;
        }
        catch (err) {
            this.logger.error(`Error in updateMedico => ${err.message}`);
            throw err;
        }
    }
    async getMedico(req) {
        const userId = req.user.id;
        this.logger.debug(`getMedico => userId: ${userId}`);
        console.log('getMedico => userId:', userId);
        try {
            const medico = await this.usersService.getMedicoByUserId(userId);
            this.logger.debug(`getMedico => result: ${JSON.stringify(medico)}`);
            console.log('getMedico => result:', medico);
            return medico;
        }
        catch (err) {
            this.logger.error(`Error in getMedico => ${err.message}`);
            throw err;
        }
    }
    async updateEmpresa(data) {
        this.logger.debug(`updateEmpresa => body: ${JSON.stringify(data)}`);
        console.log('updateEmpresa => body:', data);
        if (!data.userId) {
            this.logger.error('User ID is required in updateEmpresa');
            throw new common_1.HttpException('User ID is required', common_1.HttpStatus.BAD_REQUEST);
        }
        if (!data.name) {
            this.logger.error('El campo "name" es obligatorio en updateEmpresa');
            throw new common_1.HttpException('El campo "name" es obligatorio', common_1.HttpStatus.BAD_REQUEST);
        }
        if (data.subscription && !['ORO', 'PLATA', 'BRONCE'].includes(data.subscription)) {
            this.logger.error('Invalid subscription type in updateEmpresa');
            throw new common_1.HttpException('Subscription type must be ORO, PLATA, or BRONCE', common_1.HttpStatus.BAD_REQUEST);
        }
        try {
            const result = await this.usersService.createOrUpdateEmpresa(data.userId, data);
            this.logger.debug(`updateEmpresa => result: ${JSON.stringify(result)}`);
            console.log('updateEmpresa => result:', result);
            return result;
        }
        catch (err) {
            this.logger.error(`Error in updateEmpresa => ${err.message}`);
            throw err;
        }
    }
    async getEmpresa(req) {
        const userId = req.user.id;
        this.logger.debug(`getEmpresa => userId: ${userId}`);
        console.log('getEmpresa => userId:', userId);
        try {
            const empresa = await this.usersService.getEmpresaByUserId(userId);
            this.logger.debug(`getEmpresa => result: ${JSON.stringify(empresa)}`);
            console.log('getEmpresa => result:', empresa);
            return empresa;
        }
        catch (err) {
            this.logger.error(`Error in getEmpresa => ${err.message}`);
            throw err;
        }
    }
    async updateInstructor(data) {
        this.logger.debug(`updateInstructor => body: ${JSON.stringify(data)}`);
        console.log('updateInstructor => body:', data);
        if (!data.userId) {
            this.logger.error('User ID is required in updateInstructor');
            throw new common_1.HttpException('User ID is required', common_1.HttpStatus.BAD_REQUEST);
        }
        try {
            const result = await this.usersService.createOrUpdateInstructor(data.userId, data);
            this.logger.debug(`updateInstructor => result: ${JSON.stringify(result)}`);
            console.log('updateInstructor => result:', result);
            return result;
        }
        catch (err) {
            this.logger.error(`Error in updateInstructor => ${err.message}`);
            throw err;
        }
    }
    async getInstructor(req) {
        const userId = req.user.id;
        this.logger.debug(`getInstructor => userId: ${userId}`);
        console.log('getInstructor => userId:', userId);
        try {
            const instructor = await this.usersService.getInstructorByUserId(userId);
            this.logger.debug(`getInstructor => result: ${JSON.stringify(instructor)}`);
            console.log('getInstructor => result:', instructor);
            return instructor;
        }
        catch (err) {
            this.logger.error(`Error in getInstructor => ${err.message}`);
            throw err;
        }
    }
    async findUserById(id) {
        this.logger.debug(`findUserById => id: ${id}`);
        console.log('findUserById => id:', id);
        try {
            const user = await this.usersService.findUserById(id);
            if (!user) {
                this.logger.error('User not found in findUserById');
                throw new common_1.HttpException('User not found', common_1.HttpStatus.NOT_FOUND);
            }
            const { password, ...userWithoutPassword } = user;
            this.logger.debug(`findUserById => userWithoutPassword: ${JSON.stringify(userWithoutPassword)}`);
            console.log('findUserById => userWithoutPassword:', userWithoutPassword);
            return userWithoutPassword;
        }
        catch (err) {
            this.logger.error(`Error in findUserById => ${err.message}`);
            throw err;
        }
    }
};
exports.UsersController = UsersController;
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Check if a user exists by email' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'User found.' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'User not found.' }),
    (0, common_1.Get)('check-email'),
    __param(0, (0, common_1.Query)('email')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "checkUserByEmail", null);
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
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [update_user_dto_1.UpdateUserDto]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "completeProfile", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Crear o actualizar un Medico con carga de archivo' }),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file')),
    (0, common_1.Put)('medico'),
    __param(0, (0, common_1.Req)()),
    __param(1, (0, common_1.UploadedFile)()),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, update_medico_dto_1.UpdateMedicoDto]),
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
    (0, swagger_1.ApiOperation)({ summary: 'Create or update an Empresa' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Empresa updated successfully.' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad request.' }),
    (0, swagger_1.ApiBody)({ type: update_empresa_dto_1.CreateEmpresaDto }),
    (0, common_1.Put)('empresa'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [update_empresa_dto_1.CreateEmpresaDto]),
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
    (0, swagger_1.ApiOperation)({ summary: 'Create or update an Instructor' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Instructor updated successfully.' }),
    (0, swagger_1.ApiResponse)({ status: 400, description: 'Bad request.' }),
    (0, swagger_1.ApiBody)({ type: update_instructor_dto_1.UpdateInstructorDto }),
    (0, common_1.Put)('instructor'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [update_instructor_dto_1.UpdateInstructorDto]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "updateInstructor", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Get Instructor information' }),
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
exports.UsersController = UsersController = UsersController_1 = __decorate([
    (0, swagger_1.ApiTags)('users'),
    (0, common_1.Controller)('users'),
    __metadata("design:paramtypes", [users_service_1.UsersService,
        cloudinary_service_1.CloudinaryService])
], UsersController);
//# sourceMappingURL=users.controller.js.map