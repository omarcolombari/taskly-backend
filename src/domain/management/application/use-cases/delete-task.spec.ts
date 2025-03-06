import { InMemoryTasksRepository } from 'test/repositories/in-memory-tasks-repository'
import { makeTask } from 'test/factories/make-task'
import { DeleteTaskUseCase } from './delete-task'
import { TaskNotFoundError } from './errors/task-not-found-error'
import { InMemoryUsersRepository } from 'test/repositories/in-memory-users-repository'
import { makeUser } from 'test/factories/make-user'
import { NotAllowedError } from './errors/not-allowed-error'

let inMemoryTasksRepository: InMemoryTasksRepository
let inMemoryUsersRepository: InMemoryUsersRepository
let sut: DeleteTaskUseCase

describe('Delete task', () => {
  beforeEach(() => {
    inMemoryTasksRepository = new InMemoryTasksRepository()
    inMemoryUsersRepository = new InMemoryUsersRepository()
    sut = new DeleteTaskUseCase(inMemoryTasksRepository)
  })

  it('should be able to delete task', async () => {
    const user = makeUser()
    const task = makeTask({ userId: user.id })

    inMemoryTasksRepository.create(task)
    inMemoryUsersRepository.create(user)

    const result = await sut.execute({
      taskId: task.id.toString(),
      userId: user.id.toString(),
    })

    expect(result.isRight()).toBe(true)
    expect(inMemoryTasksRepository.items).toHaveLength(0)
  })

  it("should not be able to delete another user's task", async () => {
    const user = makeUser()
    const task1 = makeTask()
    const task2 = makeTask({ userId: user.id })

    inMemoryTasksRepository.items.push(task1, task2)
    inMemoryUsersRepository.create(user)

    const result = await sut.execute({
      taskId: task1.id.toString(),
      userId: user.id.toString(),
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(NotAllowedError)
  })

  it('should not be able to delete task if it does not exist', async () => {
    const result = await sut.execute({
      taskId: 'fake-task-id',
      userId: 'fake-user-id',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(TaskNotFoundError)
  })
})
