import type { TasksRepository } from '@/domain/management/application/repositories/tasks-repository'
import type { Task } from '@/domain/management/enterprise/entities/task'

export class InMemoryTasksRepository implements TasksRepository {
  public items: Task[] = []

  async create(task: Task) {
    this.items.push(task)
  }
}
