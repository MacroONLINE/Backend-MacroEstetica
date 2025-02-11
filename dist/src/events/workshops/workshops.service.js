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
exports.WorkshopsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const crypto_1 = require("crypto");
let WorkshopsService = class WorkshopsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async createWorkshop(data) {
        const channelName = data.channelName || (0, crypto_1.randomUUID)();
        return this.prisma.workshop.create({
            data: {
                eventId: data.eventId,
                title: data.title,
                description: data.description,
                whatYouWillLearn: data.whatYouWillLearn,
                price: data.price,
                startDateTime: data.startDateTime,
                endDateTime: data.endDateTime,
                channelName,
            },
        });
    }
    async getWorkshopById(id) {
        return this.prisma.workshop.findUnique({
            where: { id },
            include: {
                event: true,
                orators: true,
                enrollments: {
                    include: {
                        user: true,
                    },
                },
            },
        });
    }
    async updateWorkshop(id, data) {
        const workshop = await this.prisma.workshop.findUnique({ where: { id } });
        if (!workshop)
            throw new common_1.NotFoundException('Workshop no encontrado');
        return this.prisma.workshop.update({
            where: { id },
            data: {
                title: data.title,
                description: data.description,
                whatYouWillLearn: data.whatYouWillLearn,
                price: data.price,
                startDateTime: data.startDateTime,
                endDateTime: data.endDateTime,
                channelName: data.channelName,
            },
        });
    }
    async deleteWorkshop(id) {
        const workshop = await this.prisma.workshop.findUnique({ where: { id } });
        if (!workshop)
            throw new common_1.NotFoundException('Workshop no encontrado');
        await this.prisma.workshop.delete({ where: { id } });
        return { message: 'Workshop eliminado correctamente' };
    }
    async getWorkshopByChannel(channelName) {
        return this.prisma.workshop.findUnique({
            where: { channelName },
            include: {
                event: true,
                orators: true,
                enrollments: {
                    include: {
                        user: true,
                    },
                },
            },
        });
    }
};
exports.WorkshopsService = WorkshopsService;
exports.WorkshopsService = WorkshopsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], WorkshopsService);
//# sourceMappingURL=workshops.service.js.map