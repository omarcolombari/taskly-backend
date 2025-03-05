import { Entity } from '@/core/entity'
import type { UniqueEntityId } from '@/core/unique-entity-id'

export interface UserProps {
  name: string
  email: string
  password: string
}

export class User extends Entity<UserProps> {
  static create(props: UserProps, id?: UniqueEntityId) {
    const user = new User(props, id)

    return user
  }

  get name() {
    return this.props.name
  }

  get email() {
    return this.props.email
  }

  get password() {
    return this.props.password
  }
}
