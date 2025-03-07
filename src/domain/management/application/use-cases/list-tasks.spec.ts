import { InMemoryTasksRepository } from 'test/repositories/in-memory-tasks-repository'
import { makeTask } from 'test/factories/make-task'
import { ListTasksUseCase } from './list-tasks'
import { InMemoryUsersRepository } from 'test/repositories/in-memory-users-repository'
import { makeUser } from 'test/factories/make-user'
import { UserNotFoundError } from './errors/user-not-found-error'

let inMemoryTasksRepository: InMemoryTasksRepository
let inMemoryUsersRepository: InMemoryUsersRepository
let sut: ListTasksUseCase

describe('List tasks', () => {
  beforeEach(() => {
    inMemoryTasksRepository = new InMemoryTasksRepository()
    inMemoryUsersRepository = new InMemoryUsersRepository()
    sut = new ListTasksUseCase(inMemoryTasksRepository, inMemoryUsersRepository)
  })

  it('should be able to list all tasks', async () => {
    const user = makeUser()
    inMemoryUsersRepository.create(user)

    inMemoryTasksRepository.items.push(
      makeTask({ status: 'COMPLETED', userId: user.id }),
      makeTask({ status: 'COMPLETED', userId: user.id }),
      makeTask({ userId: user.id }),
      makeTask({ userId: user.id }),
      makeTask({ userId: user.id })
    )

    const result = await sut.execute({
      status: 'ALL',
      userId: user.id.toString(),
    })

    expect(result.isRight()).toBe(true)
    if (result.isRight()) {
      expect(result.value?.tasks).toHaveLength(5)
    }
  })

  it('should be able to list completed tasks', async () => {
    const user = makeUser()
    inMemoryUsersRepository.create(user)

    inMemoryTasksRepository.items.push(
      makeTask({ status: 'COMPLETED', userId: user.id }),
      makeTask({ status: 'COMPLETED', userId: user.id }),
      makeTask({ userId: user.id }),
      makeTask({ userId: user.id }),
      makeTask({ userId: user.id })
    )

    const result = await sut.execute({
      status: 'COMPLETED',
      userId: user.id.toString(),
    })

    expect(result.isRight()).toBe(true)
    if (result.isRight()) {
      expect(result.value?.tasks).toHaveLength(2)
    }
  })

  it('should be able to list pending tasks', async () => {
    const user = makeUser()
    inMemoryUsersRepository.create(user)

    inMemoryTasksRepository.items.push(
      makeTask({ status: 'COMPLETED', userId: user.id }),
      makeTask({ status: 'COMPLETED', userId: user.id }),
      makeTask({ userId: user.id }),
      makeTask({ userId: user.id }),
      makeTask({ userId: user.id })
    )

    const result = await sut.execute({
      status: 'PENDING',
      userId: user.id.toString(),
    })

    expect(result.isRight()).toBe(true)
    if (result.isRight()) {
      expect(result.value?.tasks).toHaveLength(3)
    }
  })

  it('should not be able to list when user not exists', async () => {
    inMemoryTasksRepository.items.push(
      makeTask(),
      makeTask(),
      makeTask(),
      makeTask(),
      makeTask()
    )

    const result = await sut.execute({
      status: 'COMPLETED',
      userId: 'fake-user-id',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(UserNotFoundError)
  })
})
