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
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const users_service_1 = require("../users/users.service");
const bcrypt = require("bcrypt");
const common_2 = require("@nestjs/common");
const common_3 = require("@nestjs/common");
let AuthService = class AuthService {
    constructor(usersService) {
        this.usersService = usersService;
    }
    async validateUser(email, pass) {
        const user = await this.usersService.findUserByEmail(email);
        if (user && (await bcrypt.compare(pass, user.password))) {
            const { password, ...result } = user;
            return result;
        }
        return null;
    }
    async login(user) {
        return { success: true };
    }
    async register(data) {
        const { email, password, role } = data;
        const existingUser = await this.usersService.findUserByEmail(email);
        if (existingUser) {
            throw new common_2.HttpException('User already exists', common_3.HttpStatus.CONFLICT);
        }
        if (role === 'MEDICO' && !data.verificacion) {
            throw new common_2.HttpException('Verificacion is required for MEDICO role', common_3.HttpStatus.BAD_REQUEST);
        }
        if (role === 'EMPRESA' && !data.dni) {
            throw new common_2.HttpException('DNI is required for EMPRESA role', common_3.HttpStatus.BAD_REQUEST);
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const dataObject = Object.assign({}, data);
        const { verificacion, dni, ...userDataForUser } = dataObject;
        const userCreateInput = {
            ...userDataForUser,
            password: hashedPassword,
        };
        if (role === 'MEDICO') {
            userCreateInput.medico = {
                create: {
                    verificacion: verificacion,
                },
            };
        }
        if (role === 'EMPRESA') {
            userCreateInput.empresa = {
                create: {
                    dni: dni,
                },
            };
        }
        const user = await this.usersService.createUser(userCreateInput);
        const { password: _, ...userWithoutPassword } = user;
        return { message: 'User created successfully', user: userWithoutPassword };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [users_service_1.UsersService])
], AuthService);
//# sourceMappingURL=auth.service.js.map