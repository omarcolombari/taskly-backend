import { BadRequestException, Controller, Get, Query } from '@nestjs/common'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import { z } from 'zod'
import { ListTasksUseCase } from '@/domain/management/application/use-cases/list-tasks'
import { UserPayload } from '@/infra/auth/jwt.strategy'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { TaskPresenter } from '../presenters/task-presenter'

const statusQueryParamSchema = z
  .enum(['all', 'pending', 'completed'])
  .optional()
  .default('all')
  .transform(arg => arg.toUpperCase())

const queryValidationPipe = new ZodValidationPipe(statusQueryParamSchema)

type StatusQueryParamSchema = z.infer<typeof statusQueryParamSchema>

@Controller('/tasks')
export class ListTasksController {
  constructor(private listTasks: ListTasksUseCase) {}

  @Get()
  async handle(
    @Query('status', queryValidationPipe) status: StatusQueryParamSchema,
    @CurrentUser() user: UserPayload
  ) {
    const userId = user.sub

    const result = await this.listTasks.execute({
      status: status as 'ALL' | 'PENDING' | 'COMPLETED',
      userId,
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }

    const tasks = result.value.tasks

    return { tasks: tasks.map(TaskPresenter.toHTTP) }
  }
}
