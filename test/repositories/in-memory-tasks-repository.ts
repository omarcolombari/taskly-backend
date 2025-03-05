import type { TasksRepository } from '@/domain/management/application/repositories/tasks-repository'
import type { Task } from '@/domain/management/enterprise/entities/task'

export class InMemoryTasksRepository implements TasksRepository {
  public items: Task[] = []

  async findById(taskId: string): Promise<Task | null> {
    const task = this.items.find(item => item.id.toString() === taskId)

    if (!task) {
      return null
    }

    return task
  }

  async save(task: Task): Promise<void> {
    const itemIndex = this.items.findIndex(item => item.id === task.id)

    this.items[itemIndex] = task
  }

  async create(task: Task) {
    this.items.push(task)
  }
}
