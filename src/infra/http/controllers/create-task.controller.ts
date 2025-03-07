import { BadRequestException, Body, Controller, Post } from '@nestjs/common'
import { z } from 'zod'
import { ZodValidationPipe } from '../pipes/zod-validation-pipe'
import { CreateTaskUseCase } from '@/domain/management/application/use-cases/create-task'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { UserPayload } from '@/infra/auth/jwt.strategy'
import { ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger'

import { createZodDto } from '@anatine/zod-nestjs'
import { extendApi } from '@anatine/zod-openapi'

export const createTaskBodySchema = extendApi(
  z.object({
    name: z.string(),
    description: z.string(),
  })
)

export class CreateTaskBodyDto extends createZodDto(createTaskBodySchema) {}

const bodyValidationPipe = new ZodValidationPipe(createTaskBodySchema)

@ApiTags('Tasks')
@Controller('/tasks')
export class CreateTaskController {
  constructor(private createTask: CreateTaskUseCase) {}

  @Post()
  @ApiOperation({ operationId: 'createTask' })
  @ApiBody({ type: CreateTaskBodyDto })
  async handle(
    @Body(bodyValidationPipe) body: CreateTaskBodyDto,
    @CurrentUser() user: UserPayload
  ) {
    const { name, description } = body
    const userId = user.sub

    const result = await this.createTask.execute({
      name,
      description,
      userId,
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }
  }
}
