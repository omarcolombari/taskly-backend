import { InMemoryTasksRepository } from 'test/repositories/in-memory-tasks-repository'
import { makeTask } from 'test/factories/make-task'
import { EditTaskUseCase } from './edit-task'
import { TaskNotFoundError } from './errors/task-not-found-error'

let inMemoryTasksRepository: InMemoryTasksRepository

let sut: EditTaskUseCase

describe('Edit task', () => {
  beforeEach(() => {
    inMemoryTasksRepository = new InMemoryTasksRepository()

    sut = new EditTaskUseCase(inMemoryTasksRepository)
  })

  it('should be able to edit task', async () => {
    const task = makeTask()

    inMemoryTasksRepository.create(task)

    const result = await sut.execute({
      name: 'Edited task name',
      description: 'Edited task description',
      taskId: task.id.toString(),
    })

    expect(result.isRight()).toBe(true)
    expect(inMemoryTasksRepository.items[0]).toMatchObject({
      name: 'Edited task name',
      description: 'Edited task description',
    })
  })

  it('should not be able to edit task if it does not exist', async () => {
    const result = await sut.execute({
      name: 'Edited task name',
      description: 'Edited task description',
      taskId: 'fake-task-id',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(TaskNotFoundError)
  })
})
