import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { Task } from '@/domain/management/enterprise/entities/task'
import type { Task as PrismaTask, Prisma } from '@prisma/client'

export class PrismaTaskMapper {
  static toDomain(raw: PrismaTask): Task {
    return Task.create(
      {
        name: raw.name,
        description: raw.description,
        userId: new UniqueEntityId(raw.userId),
        completedAt: raw.completedAt,
        createdAt: raw.createdAt,
        status: raw.status,
        updatedAt: raw.updatedAt,
      },
      new UniqueEntityId(raw.id)
    )
  }

  static toPrisma(task: Task): Prisma.TaskUncheckedCreateInput {
    return {
      id: task.id.toString(),
      name: task.name,
      description: task.description,
      userId: task.userId.toString(),
      status: task.status,
      completedAt: task.completedAt,
      createdAt: task.createdAt,
      updatedAt: task.updatedAt,
    }
  }
}
