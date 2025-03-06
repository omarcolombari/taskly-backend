import {
  BadRequestException,
  Body,
  Controller,
  Post,
  UseGuards,
} from '@nestjs/common'
import { z } from 'zod'
import { ZodValidationPipe } from '../pipes/zod-validation-pipe'
import { CreateTaskUseCase } from '@/domain/management/application/use-cases/create-task'
import { Public } from '@/infra/auth/public'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { UserPayload } from '@/infra/auth/jwt.strategy'
// import { JwtAuthGuard } from '@/infra/auth/jwt-auth.guard'
import { AuthGuard } from '@nestjs/passport'

const createTaskBodySchema = z.object({
  name: z.string(),
  description: z.string(),
})

const bodyValidationPipe = new ZodValidationPipe(createTaskBodySchema)

type CreateTaskBodySchema = z.infer<typeof createTaskBodySchema>

@Controller('/tasks')
export class CreateTaskController {
  constructor(private createTask: CreateTaskUseCase) {}

  @Post()
  async handle(
    @Body(bodyValidationPipe) body: CreateTaskBodySchema,
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
