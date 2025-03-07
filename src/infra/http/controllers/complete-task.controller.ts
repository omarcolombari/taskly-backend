import {
  BadRequestException,
  Controller,
  HttpCode,
  NotFoundException,
  Param,
  Patch,
} from '@nestjs/common'
import { CompleteTaskUseCase } from '@/domain/management/application/use-cases/complete-task'
import { TaskNotFoundError } from '@/domain/management/application/use-cases/errors/task-not-found-error'
import { ApiOperation, ApiTags } from '@nestjs/swagger'

@ApiTags('Tasks')
@Controller('/tasks/:id/complete')
export class CompleteTaskController {
  constructor(private completeTask: CompleteTaskUseCase) {}

  @Patch()
  @ApiOperation({ operationId: 'completeTask' })
  @HttpCode(204)
  async handle(@Param('id') taskId: string) {
    const result = await this.completeTask.execute({
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
