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
exports.BannerController = void 0;
const common_1 = require("@nestjs/common");
const banner_service_1 = require("./banner.service");
const banner_dto_1 = require("./dto/banner.dto");
const swagger_1 = require("@nestjs/swagger");
let BannerController = class BannerController {
    constructor(bannerService) {
        this.bannerService = bannerService;
    }
    async createBanner(body) {
        try {
            const newBanner = await this.bannerService.createBanner(body);
            return newBanner;
        }
        catch (error) {
            throw new common_1.HttpException(error.message, common_1.HttpStatus.BAD_REQUEST);
        }
    }
    async getBannerById(id) {
        const banner = await this.bannerService.getBannerById(id);
        if (!banner) {
            throw new common_1.HttpException('Banner no encontrado', common_1.HttpStatus.NOT_FOUND);
        }
        return banner;
    }
    async getRandomBanner() {
        const banner = await this.bannerService.getRandomBanner();
        if (!banner) {
            throw new common_1.HttpException('No hay banners en la base de datos', common_1.HttpStatus.NOT_FOUND);
        }
        return banner;
    }
};
exports.BannerController = BannerController;
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Crear un nuevo banner' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Banner creado correctamente.' }),
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [banner_dto_1.CreateBannerDto]),
    __metadata("design:returntype", Promise)
], BannerController.prototype, "createBanner", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Obtener banner por ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Banner encontrado.' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'No se encontró el banner.' }),
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], BannerController.prototype, "getBannerById", null);
__decorate([
    (0, swagger_1.ApiOperation)({ summary: 'Obtener banner aleatorio' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Banner aleatorio encontrado.' }),
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], BannerController.prototype, "getRandomBanner", null);
exports.BannerController = BannerController = __decorate([
    (0, swagger_1.ApiTags)('banners'),
    (0, common_1.Controller)('banners'),
    __metadata("design:paramtypes", [banner_service_1.BannerService])
], BannerController);
//# sourceMappingURL=banner.controller.js.map