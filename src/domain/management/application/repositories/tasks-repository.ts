import type { Task } from '../../enterprise/entities/task'

export abstract class TasksRepository {
  abstract findById(taskId: string): Promise<Task | null>
  abstract listByUserId(
    params: {
      status: 'ALL' | 'PENDING' | 'COMPLETED'
    },
    userId: string
  ): Promise<Task[]>
  abstract save(task: Task): Promise<void>
  abstract create(task: Task): Promise<void>
  abstract delete(task: Task): Promise<void>
}
