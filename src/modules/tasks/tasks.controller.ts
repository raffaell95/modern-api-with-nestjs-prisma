import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, ParseUUIDPipe, Post, Put, Query, UseGuards, UseInterceptors } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { TaskFullDTO, TaskListItemDTO, TaskRequestDTO } from './tasks.dto';
import { ValidateResourcesIdsInterceptor } from 'src/common/interceptors/validate-resources-ids.interceptor';
import { ValidateResourcesIds } from 'src/common/decorators/validate-resources-ids.decorator';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth/jwt-auth.guard';
import { ApiBearerAuth, ApiCreatedResponse, ApiNoContentResponse, ApiOkResponse } from '@nestjs/swagger';
import { ApiPaginatedResponse } from 'src/common/swagger/api-paginated-response';
import { Task } from '@prisma/client';
import { QueryPaginationDto } from 'src/common/dtos/query-pagination.dto';

@Controller({
  version: '1',
  path: 'projects/:projectId/tasks'
})
@UseInterceptors(ValidateResourcesIdsInterceptor)
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('jwt')
export class TasksController {

  constructor(private readonly tasksService: TasksService) {}

  @Get()
  @ValidateResourcesIds()
  @ApiPaginatedResponse(TaskListItemDTO)
  findAllByProject(
    @Param('projectId', ParseUUIDPipe) projectId: string,
    @Query() query?: QueryPaginationDto
  ) {
    return this.tasksService.findAllByProjectId(projectId, query)
  }

  @Post()
  @ValidateResourcesIds()
  @ApiCreatedResponse({ type: TaskListItemDTO })
  @HttpCode(HttpStatus.CREATED)
  create(@Param('projectId', ParseUUIDPipe) projectId: string, @Body() data: TaskRequestDTO) {
    return this.tasksService.create(projectId, data)
  }

  @Get(':taskId')
  @ValidateResourcesIds()
  @ApiOkResponse({ type: TaskFullDTO })
  findOne(@Param('projectId', ParseUUIDPipe) projectId: string, @Param('taskId', ParseUUIDPipe) taskId: string) {
    return this.tasksService.findById(projectId, taskId)
  }

  @Put(':taskId')
  @ValidateResourcesIds()
  @ApiOkResponse({ type: TaskListItemDTO })
  @HttpCode(HttpStatus.OK)
  update(@Param('projectId', ParseUUIDPipe) projectId: string, @Param('taskId', ParseUUIDPipe) taskId: string, @Body() data: TaskRequestDTO) {
    return this.tasksService.update(projectId, taskId, data)
  }

  @Delete(':taskId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ValidateResourcesIds()
  @ApiNoContentResponse({description: 'Task deleted successfully'})
  remove(@Param('projectId', ParseUUIDPipe) projectId: string, @Param('taskId', ParseUUIDPipe) taskId: string) {
    return this.tasksService.delete(projectId, taskId)
  }
}
