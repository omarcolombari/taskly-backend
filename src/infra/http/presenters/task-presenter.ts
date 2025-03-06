import { Task } from '@/domain/management/enterprise/entities/task'

export class TaskPresenter {
  static toHTTP(task: Task) {
    return {
      id: task.id.toString(),
      name: task.name,
      description: task.description,
      status: task.status,
      completedAt: task.completedAt,
      createdAt: task.completedAt,
      updatedAt: task.updatedAt,
    }
  }
}
