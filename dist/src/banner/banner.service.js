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
exports.BannerService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let BannerService = class BannerService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async createBanner(data) {
        return this.prisma.banner.create({
            data,
        });
    }
    async getBannerById(id) {
        const banner = await this.prisma.banner.findUnique({
            where: { id },
        });
        return banner;
    }
    async getRandomBanner() {
        const count = await this.prisma.banner.count();
        if (count === 0) {
            return null;
        }
        const randomIndex = Math.floor(Math.random() * count);
        const banners = await this.prisma.banner.findMany({
            skip: randomIndex,
            take: 1,
        });
        return banners[0];
    }
};
exports.BannerService = BannerService;
exports.BannerService = BannerService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], BannerService);
//# sourceMappingURL=banner.service.js.map