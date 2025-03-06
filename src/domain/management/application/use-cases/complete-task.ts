import { type Either, left, right } from '@/core/either'
import { Injectable } from '@nestjs/common'
import type { Task } from '../../enterprise/entities/task'
import { TasksRepository } from '../repositories/tasks-repository'
import { TaskNotFoundError } from './errors/task-not-found-error'

interface CompleteTaskUseCaseRequest {
  taskId: string
}

type CompleteTaskUseCaseResponse = Either<
  TaskNotFoundError,
  {
    task: Task
  }
>

@Injectable()
export class CompleteTaskUseCase {
  constructor(private tasksRepository: TasksRepository) {}

  async execute({
    taskId,
  }: CompleteTaskUseCaseRequest): Promise<CompleteTaskUseCaseResponse> {
    const task = await this.tasksRepository.findById(taskId)

    if (!task) {
      return left(new TaskNotFoundError())
    }

    task.completeTask()

    await this.tasksRepository.save(task)

    return right({
      task,
    })
  }
}
