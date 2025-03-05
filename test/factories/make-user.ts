import { faker } from '@faker-js/faker'

import type { UniqueEntityId } from '@/core/entities/unique-entity-id'
import {
  User,
  type UserProps,
} from '@/domain/management/enterprise/entities/user'

export function makeUser(
  override: Partial<UserProps> = {},
  id?: UniqueEntityId
) {
  const user = User.create(
    {
      name: faker.person.fullName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
      ...override,
    },
    id
  )

  return user
}
