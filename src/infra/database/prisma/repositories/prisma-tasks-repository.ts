import { Injectable } from '@nestjs/common'
import type { TasksRepository } from '@/domain/management/application/repositories/tasks-repository'
import type { Task } from '@/domain/management/enterprise/entities/task'
import { PrismaService } from '../prisma.service'
import { PrismaTaskMapper } from '../mappers/prisma-task-mapper'

@Injectable()
export class PrismaTasksRepository implements TasksRepository {
  constructor(private prisma: PrismaService) {}

  async findById(taskId: string): Promise<Task | null> {
    const task = await this.prisma.task.findUnique({
      where: {
        id: taskId,
      },
    })

    if (!task) {
      return null
    }

    return PrismaTaskMapper.toDomain(task)
  }
  async list(params: { status: 'ALL' | 'PENDING' | 'COMPLETED' }): Promise<
    Task[]
  > {
    const where = params.status === 'ALL' ? {} : { status: params.status }

    const tasks = await this.prisma.task.findMany({
      where,
      orderBy: {
        createdAt: 'desc',
      },
    })

    return tasks.map(PrismaTaskMapper.toDomain)
  }

  async create(task: Task) {
    const data = PrismaTaskMapper.toPrisma(task)

    await this.prisma.task.create({
      data,
    })
  }

  async save(task: Task): Promise<void> {
    const data = PrismaTaskMapper.toPrisma(task)

    await this.prisma.task.update({
      where: {
        id: data.id,
      },
      data,
    })
  }

  async delete(task: Task): Promise<void> {
    const data = PrismaTaskMapper.toPrisma(task)

    await this.prisma.task.delete({
      where: {
        id: data.id,
      },
    })
  }
}
