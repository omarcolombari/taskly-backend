import type { TasksRepository } from '@/domain/management/application/repositories/tasks-repository'
import type { Task } from '@/domain/management/enterprise/entities/task'

export class InMemoryTasksRepository implements TasksRepository {
  public items: Task[] = []

  async listByUserId(
    params: { status: 'ALL' | 'PENDING' | 'COMPLETED' },
    userId: string
  ): Promise<Task[]> {
    if (params.status === 'ALL') {
      return this.items.filter(item => item.userId.toString() === userId)
    }

    const filteredTasks = this.items.filter(
      item => item.status === params.status && item.userId.toString() === userId
    )

    return filteredTasks
  }

  async findById(taskId: string): Promise<Task | null> {
    const task = this.items.find(item => item.id.toString() === taskId)

    if (!task) {
      return null
    }

    return task
  }

  async delete(task: Task): Promise<void> {
    const itemIndex = this.items.findIndex(item => item.id === task.id)

    this.items.splice(itemIndex, 1)
  }

  async create(task: Task) {
    this.items.push(task)
  }

  async save(task: Task): Promise<void> {
    const itemIndex = this.items.findIndex(item => item.id === task.id)

    this.items[itemIndex] = task
  }
}
