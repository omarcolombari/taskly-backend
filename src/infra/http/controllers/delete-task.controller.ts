import {
  BadRequestException,
  Controller,
  Delete,
  HttpCode,
  Param,
} from '@nestjs/common'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { UserPayload } from '@/infra/auth/jwt.strategy'
import { DeleteTaskUseCase } from '@/domain/management/application/use-cases/delete-task'
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger'

@ApiTags('Tasks')
@Controller('/tasks/:id')
export class DeleteTaskController {
  constructor(private deleteTask: DeleteTaskUseCase) {}

  @Delete()
  @ApiBearerAuth()
  @ApiOperation({ operationId: 'deleteTask' })
  @HttpCode(204)
  async handle(@CurrentUser() user: UserPayload, @Param('id') taskId: string) {
    const userId = user.sub

    const result = await this.deleteTask.execute({
      taskId,
      userId,
    })

    if (result.isLeft()) {
      throw new BadRequestException()
    }
  }
}
