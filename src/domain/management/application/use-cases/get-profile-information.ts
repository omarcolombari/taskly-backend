import { type Either, left, right } from '@/core/either'
import { Injectable } from '@nestjs/common'
import type { User } from '../../enterprise/entities/user'
import { UsersRepository } from '../repositories/users-repository'
import { UserNotFoundError } from './errors/user-not-found-error'

interface GetProfileInformationUseCaseRequest {
  userId: string
}

type GetProfileInformationUseCaseResponse = Either<
  UserNotFoundError,
  {
    user: User
  }
>

@Injectable()
export class GetProfileInformationUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute({
    userId,
  }: GetProfileInformationUseCaseRequest): Promise<GetProfileInformationUseCaseResponse> {
    const user = await this.usersRepository.findById(userId)

    if (!user) {
      return left(new UserNotFoundError())
    }

    return right({
      user,
    })
  }
}
