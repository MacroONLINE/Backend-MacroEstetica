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
const client_1 = require("@prisma/client");
const jwt_auth_guard_1 = require("../auth/guards/jwt-auth.guard");
const common_2 = require("@nestjs/common");
let UsersController = class UsersController {
    constructor(usersService) {
        this.usersService = usersService;
    }
    async register(userData) {
        const { password, email } = userData;
        const existingUser = await this.usersService.findUserByEmail(email);
        if (existingUser) {
            throw new common_1.HttpException('User already exists', common_1.HttpStatus.CONFLICT);
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await this.usersService.createUser({ ...userData, password: hashedPassword });
        return { message: 'User created successfully', user };
    }
    async login(loginData) {
        const { email, password } = loginData;
        const user = await this.usersService.findUserByEmail(email);
        if (!user || !(await bcrypt.compare(password, user.password))) {
            throw new common_1.HttpException('Invalid credentials', common_1.HttpStatus.UNAUTHORIZED);
        }
        return { message: 'Login successful', user };
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
};
exports.UsersController = UsersController;
__decorate([
    (0, common_1.Post)('register'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "register", null);
__decorate([
    (0, common_1.Post)('login'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "login", null);
__decorate([
    (0, common_2.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)('email/:email'),
    __param(0, (0, common_1.Param)('email')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "getUserByEmail", null);
__decorate([
    (0, common_2.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UsersController.prototype, "getUserById", null);
exports.UsersController = UsersController = __decorate([
    (0, common_1.Controller)('users'),
    __metadata("design:paramtypes", [users_service_1.UsersService])
], UsersController);
//# sourceMappingURL=users.controller.js.map