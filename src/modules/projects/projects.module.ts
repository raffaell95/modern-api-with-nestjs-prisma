import { Module } from '@nestjs/common';
import { ProjectsController } from './projects.controller';
import { ProjectsService } from './projects.service';
import { PrismaService } from 'src/prisma.service';
import { RequestContextService } from 'src/common/services/request-context/request-context.service';

@Module({
  controllers: [ProjectsController],
  providers: [ProjectsService, PrismaService, RequestContextService]
})
export class ProjectsModule {}
