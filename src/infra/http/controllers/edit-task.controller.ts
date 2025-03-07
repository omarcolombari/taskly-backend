import {
  BadRequestException,
  Body,
  Controller,
  HttpCode,
  NotFoundException,
  Param,
  Put,
} from '@nestjs/common'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import { z } from 'zod'
import { EditTaskUseCase } from '@/domain/management/application/use-cases/edit-task'
import { TaskNotFoundError } from '@/domain/management/application/use-cases/errors/task-not-found-error'
import { ApiBearerAuth, ApiBody, ApiOperation, ApiTags } from '@nestjs/swagger'
import { extendApi } from '@anatine/zod-openapi'
import { createZodDto } from '@anatine/zod-nestjs'

const editTaskBodySchema = extendApi(
  z.object({
    name: z.string(),
    description: z.string(),
  })
)

const bodyValidationPipe = new ZodValidationPipe(editTaskBodySchema)

export class EditTaskBodyDto extends createZodDto(editTaskBodySchema) {}
@ApiTags('Tasks')
@Controller('/tasks/:id')
export class EditTaskController {
  constructor(private editTask: EditTaskUseCase) {}

  @Put()
  @ApiBearerAuth()
  @HttpCode(204)
  @ApiOperation({ operationId: 'editTask' })
  @ApiBody({ type: EditTaskBodyDto })
  async handle(
    @Body(bodyValidationPipe) body: EditTaskBodyDto,
    @Param('id') taskId: string
  ) {
    const { description, name } = body

    const result = await this.editTask.execute({
      description,
      name,
      taskId,
    })

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case TaskNotFoundError:
          throw new NotFoundException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }
  }
}
