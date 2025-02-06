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
exports.EventStreamsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../../prisma/prisma.service");
const crypto_1 = require("crypto");
let EventStreamsService = class EventStreamsService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async createStream(data) {
        const channelName = data.channelName || (0, crypto_1.randomUUID)();
        return this.prisma.eventStream.create({
            data: {
                eventId: data.eventId,
                channelName,
                startDateTime: data.startDateTime,
                endDateTime: data.endDateTime,
            },
        });
    }
    async getStreamById(id) {
        return this.prisma.eventStream.findUnique({
            where: { id },
            include: {
                event: {
                    include: {
                        leadingCompany: true,
                        attendees: true,
                        organizers: true,
                        workshops: true,
                    },
                },
                orators: true,
            },
        });
    }
};
exports.EventStreamsService = EventStreamsService;
exports.EventStreamsService = EventStreamsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], EventStreamsService);
//# sourceMappingURL=event-streams.service.js.map