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
exports.EmpresaController = void 0;
const common_1 = require("@nestjs/common");
const empresa_service_1 = require("./empresa.service");
const swagger_1 = require("@nestjs/swagger");
const client_1 = require("@prisma/client");
let EmpresaController = class EmpresaController {
    constructor(empresaService) {
        this.empresaService = empresaService;
    }
    async getAllByCategory(category) {
        if (!category || !(category in client_1.EmpresaCategory)) {
            throw new common_1.HttpException('Invalid category', common_1.HttpStatus.BAD_REQUEST);
        }
        return this.empresaService.getAllByCategory(category);
    }
    async getAllByTarget(target) {
        if (!target || !(target in client_1.Target)) {
            throw new common_1.HttpException('Invalid target', common_1.HttpStatus.BAD_REQUEST);
        }
        return this.empresaService.getAllByTarget(target);
    }
};
exports.EmpresaController = EmpresaController;
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Obtener empresas por categoría' }),
    (0, common_1.Get)('by-category'),
    __param(0, (0, common_1.Query)('category')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], EmpresaController.prototype, "getAllByCategory", null);
__decorate([
    (0, common_1.Get)('by-target'),
    __param(0, (0, common_1.Query)('target')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], EmpresaController.prototype, "getAllByTarget", null);
exports.EmpresaController = EmpresaController = __decorate([
    (0, swagger_1.ApiTags)('empresa'),
    (0, common_1.Controller)('empresa'),
    __metadata("design:paramtypes", [empresa_service_1.EmpresaService])
], EmpresaController);
//# sourceMappingURL=empresa.controller.js.map