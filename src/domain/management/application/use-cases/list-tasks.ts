import { type Either, right } from '@/core/either'
import { Injectable } from '@nestjs/common'
import type { Task } from '../../enterprise/entities/task'
import type { TasksRepository } from '../repositories/tasks-repository'

interface ListTasksUseCaseRequest {
  status: 'ALL' | 'PENDING' | 'COMPLETED'
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
  }: ListTasksUseCaseRequest): Promise<ListTasksUseCaseResponse> {
    const tasks = await this.tasksRepository.list({ status })

    return right({
      tasks,
    })
  }
}
