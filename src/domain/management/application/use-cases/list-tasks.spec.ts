import { InMemoryTasksRepository } from 'test/repositories/in-memory-tasks-repository'
import { makeTask } from 'test/factories/make-task'
import { TaskNotFoundError } from './errors/task-not-found-error'
import { ListTasksUseCase } from './list-tasks'

let inMemoryTasksRepository: InMemoryTasksRepository

let sut: ListTasksUseCase

describe('List tasks', () => {
  beforeEach(() => {
    inMemoryTasksRepository = new InMemoryTasksRepository()

    sut = new ListTasksUseCase(inMemoryTasksRepository)
  })

  it('should be able to list all tasks', async () => {
    inMemoryTasksRepository.items.push(
      makeTask({ status: 'COMPLETED' }),
      makeTask({ status: 'COMPLETED' }),
      makeTask(),
      makeTask(),
      makeTask()
    )

    const result = await sut.execute({
      status: 'ALL',
    })

    expect(result.isRight()).toBe(true)
    expect(result.value?.tasks).toHaveLength(5)
  })

  it('should be able to list completed tasks', async () => {
    inMemoryTasksRepository.items.push(
      makeTask({ status: 'COMPLETED' }),
      makeTask({ status: 'COMPLETED' }),
      makeTask(),
      makeTask(),
      makeTask()
    )

    const result = await sut.execute({
      status: 'COMPLETED',
    })

    expect(result.isRight()).toBe(true)
    expect(result.value?.tasks).toHaveLength(2)
  })

  it('should be able to list pending tasks', async () => {
    inMemoryTasksRepository.items.push(
      makeTask({ status: 'COMPLETED' }),
      makeTask({ status: 'COMPLETED' }),
      makeTask(),
      makeTask(),
      makeTask()
    )

    const result = await sut.execute({
      status: 'PENDING',
    })

    expect(result.isRight()).toBe(true)
    expect(result.value?.tasks).toHaveLength(3)
  })
})
