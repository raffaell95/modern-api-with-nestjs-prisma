import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { TaskDto } from './tasks.dto';

@Injectable()
export class TasksService {

  constructor(private readonly prisma: PrismaService) {}

  async findAllByProjectId(projectId: string) {
    return this.prisma.task.findMany({ where: { projectId}})
  }

  async findById(projectId: string, taskId: string) {
    return this.prisma.task.findUnique({where: { projectId, id: taskId }})
  }

  async create(projectId: string, data: TaskDto) {
    return this.prisma.task.create({data: { ...data, projectId }})
  }

  async update(projectId: string, taskId: string, data: TaskDto) {
    return this.prisma.task.update({where: { projectId, id: taskId }, data})
  }

  async delete(projectId: string, taskId: string) {
    return this.prisma.task.delete({where: { projectId, id: taskId }})
  }

}
