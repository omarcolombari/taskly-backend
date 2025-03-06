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

const editTaskBodySchema = z.object({
  name: z.string(),
  description: z.string(),
})

const bodyValidationPipe = new ZodValidationPipe(editTaskBodySchema)

type EditTaskBodySchema = z.infer<typeof editTaskBodySchema>

@Controller('/tasks/:id')
export class EditTaskController {
  constructor(private editTask: EditTaskUseCase) {}

  @Put()
  @HttpCode(204)
  async handle(
    @Body(bodyValidationPipe) body: EditTaskBodySchema,
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
