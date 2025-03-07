import { BadRequestException, Controller, Get, Query } from '@nestjs/common'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import { z } from 'zod'
import { ListTasksUseCase } from '@/domain/management/application/use-cases/list-tasks'
import { UserPayload } from '@/infra/auth/jwt.strategy'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { TaskPresenter } from '../presenters/task-presenter'
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger'
import { extendApi } from '@anatine/zod-openapi'
import { createZodDto } from '@anatine/zod-nestjs'

const statusQueryParamSchema = z
  .enum(['all', 'pending', 'completed'])
  .optional()
  .default('all')
  .transform(arg => arg.toUpperCase())

const queryValidationPipe = new ZodValidationPipe(statusQueryParamSchema)

type StatusQueryParamSchema = z.infer<typeof statusQueryParamSchema>

const listTasksResponseSchema = extendApi(
  z.object({
    tasks: extendApi(
      z.array(
        z.object({
          id: z.string(),
          name: z.string(),
          description: z.string(),
          status: z.string(),
          completedAt: z.string(),
          createdAt: z.string(),
          updatedAt: z.string(),
        })
      )
    ),
  })
)

export class ListTasksResponseDto extends createZodDto(
  listTasksResponseSchema
) {}

@ApiTags('Tasks')
@Controller('/tasks')
export class ListTasksController {
  constructor(private listTasks: ListTasksUseCase) {}

  @Get()
  @ApiBearerAuth()
  @ApiOperation({ operationId: 'listTasks' })
  @ApiResponse({ type: ListTasksResponseDto, status: 200 })
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
