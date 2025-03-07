import { InMemoryUsersRepository } from 'test/repositories/in-memory-users-repository'
import { makeUser } from 'test/factories/make-user'
import { GetProfileInformationUseCase } from './get-profile-information'
import { UserNotFoundError } from './errors/user-not-found-error'

let inMemoryUsersRepository: InMemoryUsersRepository

let sut: GetProfileInformationUseCase

describe('Get profile information', () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository()

    sut = new GetProfileInformationUseCase(inMemoryUsersRepository)
  })

  it('should be able to get profile information', async () => {
    const user = makeUser({
      name: 'John Doe',
      email: 'johndoe@example.com',
    })

    inMemoryUsersRepository.create(user)

    const result = await sut.execute({
      userId: user.id.toString(),
    })

    expect(result.isRight()).toBe(true)

    expect(result.value).toMatchObject({
      user: expect.objectContaining({
        name: 'John Doe',
        email: 'johndoe@example.com',
      }),
    })
  })

  it('should not be able to get profile information if the user does not exist', async () => {
    const result = await sut.execute({
      userId: 'fake-user-id',
    })

    expect(result.isLeft()).toBe(true)
    expect(result.value).toBeInstanceOf(UserNotFoundError)
  })
})
