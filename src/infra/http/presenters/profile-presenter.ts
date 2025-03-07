import { User } from '@/domain/management/enterprise/entities/user'

export class ProfilePresenter {
  static toHTTP(user: User) {
    return {
      id: user.id.toString(),
      name: user.name,
      email: user.email,
    }
  }
}
