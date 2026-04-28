import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { TaskListItemDTO, TaskRequestDTO } from './tasks.dto';
import { QueryPaginationDto } from 'src/common/dtos/query-pagination.dto';
import { paginate, paginateOutput } from 'src/utils/pagination.utils';

@Injectable()
export class TasksService {

  constructor(private readonly prisma: PrismaService) { }

  async findAllByProjectId(projectId: string, query?: QueryPaginationDto) {
    const tasks = await this.prisma.task.findMany({
      ...paginate(query),
      where: {
        projectId
      },
      select: {
        id: true,
        title: true,
        description: true,
        status: true,
        priority: true,
        dueDate: true,
        assignee: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true
          }
        },
        createdAt: true,
        updatedAt: true
      }
    })

    const total = await this.prisma.task.count({ where: { projectId } })

    return paginateOutput<TaskListItemDTO>(tasks, total, query)
  }

  async findById(projectId: string, taskId: string) {
    return this.prisma.task.findFirst({
      where:
      {
        projectId, id: taskId

      },
      include: {
        assignee: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true
          }
        },
        comments: {
          include: {
            author: {
              select: {
                id: true,
                name: true,
                email: true,
                avatar: true
              }
            }
          }
        }
      }
    })
  }

  async create(projectId: string, data: TaskRequestDTO) {
    return this.prisma.task.create({ 
      data: { 
        ...data, 
        projectId 
      },
      include: {
        assignee: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true
          }
        }
      }
    })
  }

  async update(projectId: string, taskId: string, data: TaskRequestDTO) {
    return this.prisma.task.update({ 
      where: { 
        projectId, id: taskId 
      }, 
      data,
      include: {
        assignee: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true
          }
        }
      }
    })
  }

  async delete(projectId: string, taskId: string) {
    return this.prisma.task.delete({ where: { projectId, id: taskId } })
  }

}
