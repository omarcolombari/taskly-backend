import type { UsersRepository } from '@/domain/management/application/repositories/users-repository'
import type { User } from '@/domain/management/enterprise/entities/user'

export class InMemoryUsersRepository implements UsersRepository {
  public items: User[] = []

  async findById(userId: string): Promise<User | null> {
    const user = this.items.find(user => user.id.toString() === userId)

    if (!user) {
      return null
    }

    return user
  }

  async findByEmail(email: string) {
    const user = this.items.find(user => user.email === email)

    if (!user) {
      return null
    }

    return user
  }

  async create(user: User) {
    this.items.push(user)
  }
}
