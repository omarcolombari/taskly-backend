import { AppModule } from '@/infra/app.module'
import { DatabaseModule } from '@/infra/database/database.module'
import { PrismaService } from '@/infra/database/prisma/prisma.service'
import { INestApplication } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { TaskFactory } from 'test/factories/make-task'
import { UserFactory } from 'test/factories/make-user'

describe('Complete task (E2E)', () => {
  let app: INestApplication
  let prisma: PrismaService
  let userFactory: UserFactory
  let taskFactory: TaskFactory
  let jwt: JwtService

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule, DatabaseModule],
      providers: [UserFactory, TaskFactory],
    }).compile()

    app = moduleRef.createNestApplication()

    prisma = moduleRef.get(PrismaService)
    userFactory = moduleRef.get(UserFactory)
    taskFactory = moduleRef.get(TaskFactory)
    jwt = moduleRef.get(JwtService)

    await app.init()
  })

  test('[PATCH] /tasks/:id/complete', async () => {
    const user = await userFactory.makePrismaUser()
    const accessToken = jwt.sign({ sub: user.id.toString() })

    const task = await taskFactory.makePrismaTask({ userId: user.id })

    const taskId = task.id.toString()

    const response = await request(app.getHttpServer())
      .patch(`/tasks/${taskId}/complete`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send()

    expect(response.statusCode).toBe(204)

    const taskOnDatabase = await prisma.task.findFirst({
      where: {
        id: taskId,
      },
    })

    expect(taskOnDatabase?.status).toEqual('COMPLETED')
    expect(taskOnDatabase?.completedAt).toEqual(expect.any(Date))
  })
})
