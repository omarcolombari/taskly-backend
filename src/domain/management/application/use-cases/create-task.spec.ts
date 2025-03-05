import { makeUser } from 'test/factories/make-user'
import { InMemoryTasksRepository } from 'test/repositories/in-memory-tasks-repository'
import { CreateTaskUseCase } from './create-task'

let inMemoryTasksRepository: InMemoryTasksRepository

let sut: CreateTaskUseCase

describe('Create task', () => {
  beforeEach(() => {
    inMemoryTasksRepository = new InMemoryTasksRepository()

    sut = new CreateTaskUseCase(inMemoryTasksRepository)
  })

  it('should be able to create a new task', async () => {
    const user = makeUser()

    const result = await sut.execute({
      name: 'John Doe',
      description: 'Fake description',
      userId: user.id.toString(),
    })

    expect(result.isRight()).toBe(true)
    expect(result.value).toEqual({
      task: inMemoryTasksRepository.items[0],
    })
  })
})
