import { InMemoryTasksRepository } from 'test/repositories/in-memory-tasks-repository'
import { makeTask } from 'test/factories/make-task'
import { CompleteTaskUseCase } from './complete-task'
import { TaskNotFoundError } from './errors/task-not-found-error'

let inMemoryTasksRepository: InMemoryTasksRepository

let sut: CompleteTaskUseCase

describe('Complete task', () => {
  beforeEach(() => {
    inMemoryTasksRepository = new InMemoryTasksRepository()

    sut = new CompleteTaskUseCase(inMemoryTasksRepository)
  })

  it('should be able to complete task', async () => {
    const task = makeTask()

    inMemoryTasksRepository.create(task)

    const result = await sut.execute({
      taskId: task.id.toString(),
    })

    expect(result.isRight()).toBe(true)
    expect(inMemoryTasksRepository.items[0]).toMatchObject({
      status: 'COMPLETED',
      completedAt: expect.any(Date),
    })
  })

  it('should not be able to complete task if it does not exist', async () => {
    const result = await sut.execute({
      taskId: 'fake-task-id',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(TaskNotFoundError)
  })
})
