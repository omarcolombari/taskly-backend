import type { Task } from '../../enterprise/entities/task'

export abstract class TasksRepository {
  abstract findById(taskId: string): Promise<Task | null>
  abstract save(task: Task): Promise<void>
  abstract create(task: Task): Promise<void>
}
