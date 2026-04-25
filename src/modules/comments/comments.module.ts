import { Module } from '@nestjs/common';
import { CommentsController } from './comments.controller';
import { CommentsService } from './comments.service';
import { PrismaService } from 'src/prisma.service';
import { RequestContextService } from 'src/common/services/request-context/request-context.service';

@Module({
  controllers: [CommentsController],
  providers: [CommentsService, PrismaService, RequestContextService]
})
export class CommentsModule {}
