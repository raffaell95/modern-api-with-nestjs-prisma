import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, ParseUUIDPipe, Post, Put, UseGuards, UseInterceptors } from '@nestjs/common'
import { ProjectsService } from './projects.service'
import { ProjectFUllDTO, ProjectListItemDTO, ProjectRequestDTO } from './projects.dto'
import { ApiBearerAuth, ApiResponse } from '@nestjs/swagger'
import { ValidateResourcesIds } from 'src/common/decorators/validate-resources-ids.decorator'
import { ValidateResourcesIdsInterceptor } from 'src/common/interceptors/validate-resources-ids.interceptor'
import { JwtAuthGuard } from 'src/common/guards/jwt-auth/jwt-auth.guard'

@Controller({
  version: '1',
  path: 'projects',
})
@UseInterceptors(ValidateResourcesIdsInterceptor)
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('jwt')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Get()
  @ApiResponse({
    type: [ProjectListItemDTO]
  })
  findAll() {
    return this.projectsService.findAll()
  }

  @Get(':projectId')
  @ApiResponse({
    type: ProjectFUllDTO
  })
  @ValidateResourcesIds()
  async findOne(@Param('projectId', ParseUUIDPipe) id: string) {
    return await this.projectsService.findById(id)
  }

  @Post()
  @ApiResponse({
    type: ProjectListItemDTO
  })
  create(@Body() data: ProjectRequestDTO) {
    return this.projectsService.create(data)
  }

  @Put(':projectId')
  @ApiResponse({
    type: ProjectListItemDTO
  })
  @ValidateResourcesIds()
  async update(@Param('projectId', ParseUUIDPipe) id: string, @Body() data: ProjectRequestDTO) {
    return this.projectsService.update(id, data)
  }

  @Delete(':projectId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ValidateResourcesIds()
  async remove(@Param('projectId', ParseUUIDPipe) id: string) {
    return this.projectsService.remove(id)
  }
}
