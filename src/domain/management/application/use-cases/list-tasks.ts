import { type Either, right } from '@/core/either'
import { Injectable } from '@nestjs/common'
import type { Task } from '../../enterprise/entities/task'
import { TasksRepository } from '../repositories/tasks-repository'

interface ListTasksUseCaseRequest {
  status: 'ALL' | 'PENDING' | 'COMPLETED'
  userId: string
}

type ListTasksUseCaseResponse = Either<
  null,
  {
    tasks: Task[]
  }
>

@Injectable()
export class ListTasksUseCase {
  constructor(private tasksRepository: TasksRepository) {}

  async execute({
    status,
    userId,
  }: ListTasksUseCaseRequest): Promise<ListTasksUseCaseResponse> {
    const tasks = await this.tasksRepository.listByUserId({ status }, userId)

    return right({
      tasks,
    })
  }
}
