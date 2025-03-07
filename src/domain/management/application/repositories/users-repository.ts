import type { User } from '../../enterprise/entities/user'

export abstract class UsersRepository {
  abstract findById(userId: string): Promise<User | null>
  abstract findByEmail(email: string): Promise<User | null>
  abstract create(user: User): Promise<void>
}
