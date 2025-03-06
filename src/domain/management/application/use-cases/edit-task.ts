import { type Either, left, right } from '@/core/either'
import { Injectable } from '@nestjs/common'
import type { Task } from '../../enterprise/entities/task'
import { TasksRepository } from '../repositories/tasks-repository'
import { TaskNotFoundError } from './errors/task-not-found-error'

interface EditTaskUseCaseRequest {
  name: string
  description: string
  taskId: string
}

type EditTaskUseCaseResponse = Either<
  TaskNotFoundError,
  {
    task: Task
  }
>

@Injectable()
export class EditTaskUseCase {
  constructor(private tasksRepository: TasksRepository) {}

  async execute({
    name,
    taskId,
    description,
  }: EditTaskUseCaseRequest): Promise<EditTaskUseCaseResponse> {
    const task = await this.tasksRepository.findById(taskId)

    if (!task) {
      return left(new TaskNotFoundError())
    }

    task.name = name
    task.description = description

    await this.tasksRepository.save(task)

    return right({
      task,
    })
  }
}
