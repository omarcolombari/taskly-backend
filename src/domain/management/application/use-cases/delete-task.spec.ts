import { InMemoryTasksRepository } from 'test/repositories/in-memory-tasks-repository'
import { makeTask } from 'test/factories/make-task'
import { DeleteTaskUseCase } from './delete-task'
import { TaskNotFoundError } from './errors/task-not-found-error'

let inMemoryTasksRepository: InMemoryTasksRepository

let sut: DeleteTaskUseCase

describe('Delete task', () => {
  beforeEach(() => {
    inMemoryTasksRepository = new InMemoryTasksRepository()

    sut = new DeleteTaskUseCase(inMemoryTasksRepository)
  })

  it('should be able to delete task', async () => {
    const task = makeTask()

    inMemoryTasksRepository.create(task)

    const result = await sut.execute({
      taskId: task.id.toString(),
    })

    expect(result.isRight()).toBe(true)
    expect(inMemoryTasksRepository.items).toHaveLength(0)
  })

  it('should not be able to delete task if it does not exist', async () => {
    const result = await sut.execute({
      taskId: 'fake-task-id',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(TaskNotFoundError)
  })
})
