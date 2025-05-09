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
const swagger_1 = require("@nestjs/swagger");
const platform_express_1 = require("@nestjs/platform-express");
const bcrypt = require("bcrypt");
const users_service_1 = require("./users.service");
const create_user_dto_1 = require("./dto/create-user.dto");
const update_user_dto_1 = require("./dto/update-user.dto");
const update_medico_dto_1 = require("./dto/update-medico.dto");
const update_instructor_dto_1 = require("./dto/update-instructor.dto");
const update_empresa_dto_1 = require("./dto/update-empresa.dto");
const update_profile_dto_1 = require("./dto/update-profile.dto/update-profile.dto");
const change_password_dto_1 = require("./dto/change-password.dto/change-password.dto");
const change_email_dto_1 = require("./dto/change-email.dto/change-email.dto");
let UsersController = UsersController_1 = class UsersController {
    constructor(usersService) {
        this.usersService = usersService;
        this.logger = new common_1.Logger(UsersController_1.name);
    }
    async checkUserByEmail(email) {
        if (!email)
            throw new common_1.HttpException('Email is required', common_1.HttpStatus.BAD_REQUEST);
        return this.usersService.checkUserExistsByEmail(email);
    }
    async register(dto) {
        const exists = await this.usersService.findUserByEmail(dto.email);
        if (exists)
            throw new common_1.HttpException('User already exists', common_1.HttpStatus.CONFLICT);
        const hashed = await bcrypt.hash(dto.password, 10);
        const user = await this.usersService.createUser({ ...dto, password: hashed });
        return { message: 'User created successfully', userId: user.id };
    }
    async completeProfile(dto) {
        if (!dto.id)
            throw new common_1.HttpException('User ID required', common_1.HttpStatus.BAD_REQUEST);
        await this.usersService.updateUser(dto.id, dto);
        return { message: 'User profile updated successfully' };
    }
    async updateMedico(file, dto) {
        if (!dto.userId)
            throw new common_1.HttpException('User ID required', common_1.HttpStatus.BAD_REQUEST);
        if (file)
            dto.verification = (await this.usersService['cloudinary'].uploadImage(file)).secure_url;
        return this.usersService.createOrUpdateMedico(dto.userId, dto);
    }
    async updateEmpresa(dto) {
        if (!dto.userId)
            throw new common_1.HttpException('User ID required', common_1.HttpStatus.BAD_REQUEST);
        return this.usersService.createOrUpdateEmpresa(dto.userId, dto);
    }
    async updateInstructor(dto) {
        if (!dto.userId)
            throw new common_1.HttpException('User ID required', common_1.HttpStatus.BAD_REQUEST);
        return this.usersService.createOrUpdateInstructor(dto.userId, dto);
    }
    async updateProfile(userId, dto, file) {
        return this.usersService.updateProfile(userId, dto, file);
    }
    async uploadProfileImage(userId, file) {
        if (!file)
            throw new common_1.HttpException('File required', common_1.HttpStatus.BAD_REQUEST);
        return this.usersService.updateProfileImage(userId, file);
    }
    async changePassword(userId, dto) {
        return this.usersService.changePassword(userId, dto);
    }
    async changeEmail(userId, dto) {
        return this.usersService.changeEmail(userId, dto);
    }
    async getMedico(userId) {
        return this.usersService.getMedicoByUserId(userId);
    }
    async getEmpresa(userId) {
        return this.usersService.getEmpresaByUserId(userId);
    }
    async getInstructor(userId) {
        return this.usersService.getInstructorByUserId(userId);
    }
    async findUserById(id) {
        const user = await this.usersService.findUserById(id);
        if (!user)
            throw new common_1.HttpException('User not found', common_1.HttpStatus.NOT_FOUND);
        const { password, ...safe } = user;
        return safe;
    }
};
exports.UsersController = UsersController;
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Check if a user exists by email' }),
    (0, swagger_1.ApiResponse)({
        status: 200,
        description: 'Returns { exists: boolean, user?: Partial<User> }',
    }),
    (0, common_1.Get)('check-email'),
    __param(0, (0, common_1.Query)('email')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "checkUserByEmail", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Register a new user (Step 1)' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'User created, returns userId' }),
    (0, common_1.Post)('register'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_user_dto_1.CreateUserDto]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "register", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Complete user profile (legacy Step 2)' }),
    (0, common_1.Put)('complete-profile'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [update_user_dto_1.UpdateUserDto]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "completeProfile", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Crear o actualizar un Medico' }),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, swagger_1.ApiBody)({
        description: 'Si se envía archivo, utilizar field `file` (multipart).',
        schema: {
            type: 'object',
            required: ['userId', 'profession', 'type'],
            properties: {
                userId: { type: 'string', example: 'cm4sths4i0008g1865nsbbh1l' },
                profession: { type: 'string', example: 'MEDICO_MEDICINA_ESTETICA' },
                type: { type: 'string', example: 'MEDICO' },
                verification: { type: 'string', example: 'https://cdn.miapp.com/docs/certificado.pdf' },
                file: { type: 'string', format: 'binary' },
            },
        },
    }),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file')),
    (0, common_1.Put)('medico'),
    __param(0, (0, common_1.UploadedFile)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, update_medico_dto_1.UpdateMedicoDto]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "updateMedico", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Crear o actualizar una Empresa' }),
    (0, swagger_1.ApiBody)({
        type: update_empresa_dto_1.UpdateEmpresaDto,
        examples: {
            full: {
                summary: 'Ejemplo completo',
                value: {
                    userId: 'cm4sths4i0008g1865nsbbh1l',
                    name: 'DermaTech SA',
                    dni: 'RFC-12345678',
                    giro: 'EMPRESA_PROFESIONAL_PERFIL',
                    subscription: 'ORO',
                    bannerImage: 'https://cdn.miapp.com/banners/dermatech.jpg',
                    logo: 'https://cdn.miapp.com/logos/dermatech.png',
                    webUrl: 'https://dermatech.mx',
                    followers: 300,
                },
            },
        },
    }),
    (0, common_1.Put)('empresa'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [update_empresa_dto_1.UpdateEmpresaDto]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "updateEmpresa", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Crear o actualizar un Instructor' }),
    (0, swagger_1.ApiBody)({
        type: update_instructor_dto_1.UpdateInstructorDto,
        examples: {
            basic: {
                summary: 'Ejemplo básico',
                value: {
                    userId: 'cm4sths4i0008g1865nsbbh1l',
                    profession: 'MEDICINA_ESTETICA',
                    type: 'MEDICO',
                    description: 'Especialista en peelings químicos',
                    experienceYears: 5,
                    certificationsUrl: 'https://cdn.miapp.com/certificaciones',
                    status: 'active',
                    bannerImage: 'https://cdn.miapp.com/banners/instructor.jpg',
                    followers: 80,
                    validated: false,
                },
            },
        },
    }),
    (0, common_1.Put)('instructor'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [update_instructor_dto_1.UpdateInstructorDto]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "updateInstructor", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Update full profile (generic)' }),
    (0, swagger_1.ApiParam)({ name: 'userId', description: 'User ID' }),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, swagger_1.ApiBody)({
        description: 'Envía los campos de usuario y las secciones (medico, instructor, empresa) que apliquen. ' +
            'Para sustituir el documento de verificación adjunta opcionalmente `file` (binary).',
        schema: {
            type: 'object',
            properties: {
                firstName: { type: 'string', example: 'María' },
                lastName: { type: 'string', example: 'López' },
                phone: { type: 'string', example: '+525511112233' },
                medico: { $ref: (0, swagger_1.getSchemaPath)(update_medico_dto_1.UpdateMedicoDto) },
                empresa: { $ref: (0, swagger_1.getSchemaPath)(update_empresa_dto_1.UpdateEmpresaDto) },
                instructor: { $ref: (0, swagger_1.getSchemaPath)(update_instructor_dto_1.UpdateInstructorDto) },
                file: { type: 'string', format: 'binary' },
            },
        },
        examples: {
            user: {
                summary: 'Solo datos de usuario',
                value: { firstName: 'María', lastName: 'López', phone: '+525511112233' },
            },
            medico: {
                summary: 'Usuario MEDICO',
                value: {
                    firstName: 'Ana',
                    lastName: 'Ramírez',
                    medico: {
                        userId: 'usr123',
                        profession: 'MEDICO_MEDICINA_ESTETICA',
                        type: 'MEDICO',
                    },
                },
            },
            instructor: {
                summary: 'Usuario INSTRUCTOR',
                value: {
                    firstName: 'Carlos',
                    lastName: 'Díaz',
                    instructor: {
                        userId: 'usr456',
                        profession: 'MEDICINA_ESTETICA',
                        type: 'MEDICO',
                        description: 'Experto en láser dermatológico',
                    },
                },
            },
            empresa: {
                summary: 'Usuario EMPRESA',
                value: {
                    firstName: 'Laura',
                    lastName: 'Gómez',
                    empresa: {
                        userId: 'usr789',
                        name: 'Spa Belleza',
                        giro: 'EMPRESA_APARATOLOGIA_PERFIL',
                    },
                },
            },
        },
    }),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file')),
    (0, common_1.Put)(':userId/profile'),
    __param(0, (0, common_1.Param)('userId')),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_profile_dto_1.UpdateProfileDto, Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "updateProfile", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Upload or replace profile picture' }),
    (0, swagger_1.ApiParam)({ name: 'userId', description: 'User ID' }),
    (0, swagger_1.ApiConsumes)('multipart/form-data'),
    (0, swagger_1.ApiBody)({
        schema: {
            type: 'object',
            required: ['file'],
            properties: {
                file: { type: 'string', format: 'binary', description: 'Imagen a subir' },
            },
        },
    }),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file')),
    (0, common_1.Put)(':userId/profile-image'),
    __param(0, (0, common_1.Param)('userId')),
    __param(1, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "uploadProfileImage", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Change password' }),
    (0, swagger_1.ApiParam)({ name: 'userId', description: 'User ID' }),
    (0, swagger_1.ApiBody)({ type: change_password_dto_1.ChangePasswordDto }),
    (0, common_1.Put)(':userId/change-password'),
    __param(0, (0, common_1.Param)('userId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, change_password_dto_1.ChangePasswordDto]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "changePassword", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Change email' }),
    (0, swagger_1.ApiParam)({ name: 'userId', description: 'User ID' }),
    (0, swagger_1.ApiBody)({ type: change_email_dto_1.ChangeEmailDto }),
    (0, common_1.Put)(':userId/change-email'),
    __param(0, (0, common_1.Param)('userId')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, change_email_dto_1.ChangeEmailDto]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "changeEmail", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Get MEDICO details of a user' }),
    (0, swagger_1.ApiParam)({ name: 'userId', description: 'User ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Detalles del médico o null' }),
    (0, common_1.Get)(':userId/medico'),
    __param(0, (0, common_1.Param)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "getMedico", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Get EMPRESA details of a user' }),
    (0, swagger_1.ApiParam)({ name: 'userId', description: 'User ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Detalles de la empresa o null' }),
    (0, common_1.Get)(':userId/empresa'),
    __param(0, (0, common_1.Param)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "getEmpresa", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Get INSTRUCTOR details of a user' }),
    (0, swagger_1.ApiParam)({ name: 'userId', description: 'User ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Detalles del instructor o null' }),
    (0, common_1.Get)(':userId/instructor'),
    __param(0, (0, common_1.Param)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "getInstructor", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Get user by ID' }),
    (0, swagger_1.ApiParam)({ name: 'id', description: 'User ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'User found (password omitted)' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'User not found' }),
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "findUserById", null);
exports.UsersController = UsersController = UsersController_1 = __decorate([
    (0, swagger_1.ApiTags)('users'),
    (0, common_1.Controller)('users'),
    __metadata("design:paramtypes", [users_service_1.UsersService])
], UsersController);
//# sourceMappingURL=users.controller.js.map