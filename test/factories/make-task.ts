import { faker } from '@faker-js/faker'

import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import {
  Task,
  type TaskProps,
} from '@/domain/management/enterprise/entities/task'
import { Injectable } from '@nestjs/common'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { PrismaTaskMapper } from '@/infra/database/prisma/mappers/prisma-task-mapper'

export function makeTask(
  override: Partial<TaskProps> = {},
  id?: UniqueEntityId
) {
  const task = Task.create(
    {
      name: faker.lorem.words(2),
      description: faker.lorem.paragraph(),
      userId: new UniqueEntityId(),
      ...override,
    },
    id
  )

  return task
}

@Injectable()
export class TaskFactory {
  constructor(private prisma: PrismaService) {}

  async makePrismaTask(data: Partial<TaskProps> = {}): Promise<Task> {
    const task = makeTask(data)

    await this.prisma.task.create({
      data: PrismaTaskMapper.toPrisma(task),
    })

    return task
  }
}
