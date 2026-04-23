import { Injectable } from '@nestjs/common'
import { ProjectRequestDTO } from './projects.dto'
import { PrismaService } from 'src/prisma.service'
import { CollaboratorRole } from '@prisma/client'

@Injectable()
export class ProjectsService {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.project.findMany()
  }

  findById(id: string) {
    return this.prisma.project.findFirst({
      where: { id },
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
    const project = await this.prisma.project.create({
      data: {
        ...data,
        createdById: '123',
      },
    })

    await this.prisma.projectCollaborator.create({
      data: {
        projectId: project.id,
        userId: '123',
        role: CollaboratorRole.OWNER,
      },
    })

    return project
  }

  update(id: string, data: ProjectRequestDTO) {
    return this.prisma.project.update({ where: { id }, data })
  }

  async remove(id: string) {
    await this.prisma.task.deleteMany({ where: { projectId: id } })
    return this.prisma.project.delete({ where: { id } })
  }
}
