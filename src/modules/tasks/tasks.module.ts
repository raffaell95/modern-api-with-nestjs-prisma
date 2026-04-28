import { Module } from '@nestjs/common';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';
import { PrismaService } from 'src/prisma.service';
import { RequestContextService } from 'src/common/services/request-context/request-context.service';

@Module({
  controllers: [TasksController],
  providers: [TasksService, PrismaService, RequestContextService]
})
export class TasksModule {}
