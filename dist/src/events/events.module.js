"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventsModule = void 0;
const common_1 = require("@nestjs/common");
const events_service_1 = require("./events.service");
const events_controller_1 = require("./events.controller");
const prisma_service_1 = require("../prisma/prisma.service");
const workshops_controller_1 = require("./workshops/workshops.controller");
const workshops_service_1 = require("./workshops/workshops.service");
const classroom_controller_1 = require("./classroom/classroom.controller");
const classroom_service_1 = require("./classroom/classroom.service");
const event_streams_controller_1 = require("./event-streams/event-streams.controller");
const event_streams_service_1 = require("./event-streams/event-streams.service");
let EventsModule = class EventsModule {
};
exports.EventsModule = EventsModule;
exports.EventsModule = EventsModule = __decorate([
    (0, common_1.Module)({
        controllers: [events_controller_1.EventsController, workshops_controller_1.WorkshopsController, classroom_controller_1.ClassroomController, event_streams_controller_1.EventStreamsController],
        providers: [events_service_1.EventsService, prisma_service_1.PrismaService, workshops_service_1.WorkshopsService, classroom_service_1.ClassroomService, event_streams_service_1.EventStreamsService],
    })
], EventsModule);
//# sourceMappingURL=events.module.js.map