import { type Either, left, right } from '@/core/either'
import { Injectable } from '@nestjs/common'
import type { Task } from '../../enterprise/entities/task'
import { TasksRepository } from '../repositories/tasks-repository'
import { TaskNotFoundError } from './errors/task-not-found-error'
import { NotAllowedError } from './errors/not-allowed-error'

interface DeleteTaskUseCaseRequest {
  taskId: string
  userId: string
}

type DeleteTaskUseCaseResponse = Either<
  TaskNotFoundError | NotAllowedError,
  {
    task: Task
  }
>

@Injectable()
export class DeleteTaskUseCase {
  constructor(private tasksRepository: TasksRepository) {}

  async execute({
    taskId,
    userId,
  }: DeleteTaskUseCaseRequest): Promise<DeleteTaskUseCaseResponse> {
    const task = await this.tasksRepository.findById(taskId)

    if (!task) {
      return left(new TaskNotFoundError())
    }

    if (userId !== task.userId.toString()) {
      return left(new NotAllowedError())
    }

    await this.tasksRepository.delete(task)

    return right({
      task,
    })
  }
}
