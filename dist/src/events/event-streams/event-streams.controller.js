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
exports.EventStreamsController = void 0;
const common_1 = require("@nestjs/common");
const event_streams_service_1 = require("./event-streams.service");
let EventStreamsController = class EventStreamsController {
    constructor(eventStreamsService) {
        this.eventStreamsService = eventStreamsService;
    }
    async createStream(body) {
        return this.eventStreamsService.createStream(body);
    }
    async getStreamById(id) {
        const stream = await this.eventStreamsService.getStreamById(id);
        if (!stream)
            throw new common_1.NotFoundException('Stream no encontrado');
        return stream;
    }
};
exports.EventStreamsController = EventStreamsController;
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], EventStreamsController.prototype, "createStream", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], EventStreamsController.prototype, "getStreamById", null);
exports.EventStreamsController = EventStreamsController = __decorate([
    (0, common_1.Controller)('event-streams'),
    __metadata("design:paramtypes", [event_streams_service_1.EventStreamsService])
], EventStreamsController);
//# sourceMappingURL=event-streams.controller.js.map