import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { TaskFactory } from 'test/factories/make-task'
import { UserFactory } from 'test/factories/make-user'

describe('List tasks (E2E)', () => {
  let app: INestApplication
  let userFactory: UserFactory
  let taskFactory: TaskFactory
  let jwt: JwtService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [UserFactory, TaskFactory],
    }).compile()

    app = moduleRef.createNestApplication()

    userFactory = moduleRef.get(UserFactory)
    taskFactory = moduleRef.get(TaskFactory)
    jwt = moduleRef.get(JwtService)

    await app.init()
  })

  test('[GET] /tasks', async () => {
    const user = await userFactory.makePrismaUser()
    const accessToken = jwt.sign({ sub: user.id.toString() })

    await taskFactory.makePrismaTask({ userId: user.id, status: 'COMPLETED' })
    await taskFactory.makePrismaTask({ userId: user.id })

    const response = await request(app.getHttpServer())
      .get('/tasks?status=pending')
      .set('Authorization', `Bearer ${accessToken}`)
      .send()

    expect(response.statusCode).toBe(200)
    expect(response.body.tasks).toHaveLength(1)
    expect(response.body).toEqual({
      tasks: [expect.objectContaining({ status: 'PENDING' })],
    })
  })
})
