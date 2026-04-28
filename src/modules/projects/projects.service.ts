import { Injectable } from '@nestjs/common'
import { ProjectRequestDTO } from './projects.dto'
import { PrismaService } from 'src/prisma.service'
import { CollaboratorRole, Project } from '@prisma/client'
import { RequestContextService } from 'src/common/services/request-context/request-context.service'
import { QueryPaginationDto } from 'src/common/dtos/query-pagination.dto'
import { paginate, paginateOutput } from 'src/utils/pagination.utils'

@Injectable()
export class ProjectsService {

  constructor(
    private readonly prisma: PrismaService,
    private readonly requestContext: RequestContextService
  ) { }

  async findAll(query?: QueryPaginationDto) {
    const userId = this.requestContext.getUserId()

    const projects = await this.prisma.project.findMany({
      ...paginate(query),
      where: {
        createdById: userId,
      }
    })

    const total = await this.prisma.project.count({
      where: {
        OR: [
          { createdById: userId },
          { collaborators: { some: { userId } } }
        ]
      }
    })

    return paginateOutput<Project>(projects, total, query)
  }

  findById(id: string) {
    const userId = this.requestContext.getUserId()
    return this.prisma.project.findFirst({
      where: { id, createdById: userId },
      select: {
        id: true,
        name: true,
        description: true,
        createdAt: true,
        updatedAt: true,
        tasks: {
          select: {
            id: true,
            title: true,
            description: true,
            status: true,
            priority: true,
            dueDate: true,
            createdAt: true,
            updatedAt: true,
          },
        },
      },
    })
  }

  async create(data: ProjectRequestDTO) {
    const userId = this.requestContext.getUser()?.id
    const project = await this.prisma.project.create({
      data: {
        ...data,
        createdById: userId,
      },
    })

    await this.prisma.projectCollaborator.create({
      data: {
        projectId: project.id,
        userId: userId,
        role: CollaboratorRole.OWNER,
      },
    })

    return project
  }

  update(id: string, data: ProjectRequestDTO) {
    const userId = this.requestContext.getUserId()
    return this.prisma.project.update({ where: { id, createdById: userId }, data })
  }

  async remove(id: string) {
    const userId = this.requestContext.getUserId()
    await this.prisma.task.deleteMany({ where: { projectId: id } })
    return this.prisma.project.delete({ where: { id, createdById: userId } })
  }
}
