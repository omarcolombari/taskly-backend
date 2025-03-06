import { type Either, right } from '@/core/either'
import { Injectable } from '@nestjs/common'
import { Task } from '../../enterprise/entities/task'
import { TasksRepository } from '../repositories/tasks-repository'
import { UniqueEntityId } from '@/core/entities/unique-entity-id'

interface CreateTaskUseCaseRequest {
  name: string
  description: string
  userId: string
}

type CreateTaskUseCaseResponse = Either<
  null,
  {
    task: Task
  }
>

@Injectable()
export class CreateTaskUseCase {
  constructor(private tasksRepository: TasksRepository) {}

  async execute({
    name,
    userId,
    description,
  }: CreateTaskUseCaseRequest): Promise<CreateTaskUseCaseResponse> {
    const task = Task.create({
      name,
      userId: new UniqueEntityId(userId),
      description,
    })

    await this.tasksRepository.create(task)

    return right({
      task,
    })
  }
}
