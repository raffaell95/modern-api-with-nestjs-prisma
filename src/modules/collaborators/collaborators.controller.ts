import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, ParseUUIDPipe, Post, Put, Query, UseGuards, UseInterceptors } from '@nestjs/common';
import { CollaboratorsService } from './collaborators.service';
import { ValidateResourcesIds } from 'src/common/decorators/validate-resources-ids.decorator';
import { ValidateResourcesIdsInterceptor } from 'src/common/interceptors/validate-resources-ids.interceptor';
import { ApiBearerAuth, ApiCreatedResponse, ApiNoContentResponse, ApiResponse } from '@nestjs/swagger';
import { AddCollaboratorDTO, CollaboratorListItemDTO, UpdateCollaboratorDTO } from './colaborators.dto';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth/jwt-auth.guard';
import { QueryPaginationDto } from 'src/common/dtos/query-pagination.dto';
import { ApiPaginatedResponse } from 'src/common/swagger/api-paginated-response';

@Controller({
  version: '1',
  path: 'projects/:projectId/collaborators'
})
@UseInterceptors(ValidateResourcesIdsInterceptor)
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('jwt')
export class CollaboratorsController {
  constructor(private readonly collaboratorsService: CollaboratorsService) {}

  @Get()
  @ValidateResourcesIds()
  @ApiPaginatedResponse(CollaboratorListItemDTO)
  findAllByProject(
    @Param('projectId', ParseUUIDPipe) projectId: string,
    @Query() query?: QueryPaginationDto
  ) {
    return this.collaboratorsService.findAllByProject(projectId, query);
  }

  @Post()
  @ValidateResourcesIds()
  @ApiCreatedResponse({type: [CollaboratorListItemDTO]})
  @HttpCode(HttpStatus.CREATED)
  create(
    @Param('projectId', ParseUUIDPipe) projectId: string,
    @Body() data: AddCollaboratorDTO) {
      return this.collaboratorsService.create(projectId, data);
    }

  @Put(':userId')
  @ValidateResourcesIds()
  @ApiResponse({type: CollaboratorListItemDTO})
  update(
    @Param('projectId', ParseUUIDPipe) projectId: string,
    @Param('userId', ParseUUIDPipe) userId: string,
    @Body() data: UpdateCollaboratorDTO) {
      return this.collaboratorsService.update(projectId, userId, data);
    }

  @Delete(':userId')
  @ValidateResourcesIds()
  @ApiNoContentResponse()
  @HttpCode(HttpStatus.NO_CONTENT)
  remove(
    @Param('projectId', ParseUUIDPipe) projectId: string,
    @Param('userId', ParseUUIDPipe) userId: string) {
      return this.collaboratorsService.remove(projectId, userId);
    }

}
