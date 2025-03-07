import { type Either, left, right } from '@/core/either'
import { Injectable } from '@nestjs/common'
import type { Task } from '../../enterprise/entities/task'
import { TasksRepository } from '../repositories/tasks-repository'
import { UsersRepository } from '../repositories/users-repository'
import { UserNotFoundError } from './errors/user-not-found-error'

interface ListTasksUseCaseRequest {
  status: 'ALL' | 'PENDING' | 'COMPLETED'
  userId: string
}

type ListTasksUseCaseResponse = Either<
  UserNotFoundError,
  {
    tasks: Task[]
  }
>

@Injectable()
export class ListTasksUseCase {
  constructor(
    private tasksRepository: TasksRepository,
    private usersRepository: UsersRepository
  ) {}

  async execute({
    status,
    userId,
  }: ListTasksUseCaseRequest): Promise<ListTasksUseCaseResponse> {
    const userExists = await this.usersRepository.findById(userId)

    if (!userExists) {
      return left(new UserNotFoundError())
    }
    const tasks = await this.tasksRepository.listByUserId({ status }, userId)

    return right({
      tasks,
    })
  }
}
