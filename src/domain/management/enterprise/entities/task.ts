import { Entity } from '@/core/entity'
import type { Optional } from '@/core/types/optional'
import type { UniqueEntityId } from '@/core/unique-entity-id'

export interface TaskProps {
  name: string
  description: string
  userId: UniqueEntityId
  status: 'PENDING' | 'COMPLETED'
  completedAt?: Date | null
  createdAt: Date
  updatedAt?: Date | null
}

export class Task extends Entity<TaskProps> {
  static create(props: Optional<TaskProps, 'createdAt'>, id?: UniqueEntityId) {
    const task = new Task(
      {
        ...props,
        createdAt: new Date(),
      },
      id
    )

    return task
  }

  private touch() {
    this.props.updatedAt = new Date()
  }

  get name() {
    return this.props.name
  }

  set name(name: string) {
    this.props.name = name
    this.touch()
  }

  get description() {
    return this.props.description
  }

  set description(description: string) {
    this.props.description = description
    this.touch()
  }

  get status() {
    return this.props.status
  }

  get userId() {
    return this.props.userId
  }

  get completedAt() {
    return this.props.completedAt
  }

  get createdAt() {
    return this.props.createdAt
  }

  get updatedAt() {
    return this.props.updatedAt
  }

  completeTask() {
    this.props.completedAt = new Date()
  }
}
