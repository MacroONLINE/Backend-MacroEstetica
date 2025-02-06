import { Module } from '@nestjs/common';
import { EventsService } from './events.service';
import { EventsController } from './events.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { WorkshopsController } from './workshops/workshops.controller';
import { WorkshopsService } from './workshops/workshops.service';
import { ClassroomController } from './classroom/classroom.controller';
import { ClassroomService } from './classroom/classroom.service';
import { EventStreamsController } from './event-streams/event-streams.controller';
import { EventStreamsService } from './event-streams/event-streams.service';

@Module({
  controllers: [EventsController, WorkshopsController, ClassroomController, EventStreamsController],
  providers: [EventsService, PrismaService, WorkshopsService, ClassroomService, EventStreamsService],
})
export class EventsModule {}
