import { faker } from '@faker-js/faker'

import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import {
  Task,
  type TaskProps,
} from '@/domain/management/enterprise/entities/task'

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
