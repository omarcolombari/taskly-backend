import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  Post,
} from '@nestjs/common'
import { z } from 'zod'
import { ZodValidationPipe } from '../pipes/zod-validation-pipe'
import { CreateAccountUseCase } from '@/domain/management/application/use-cases/create-account'
import { UserAlreadyExistsError } from '@/domain/management/application/use-cases/errors/user-already-exists-error'
import { Public } from '@/infra/auth/public'
import { ApiBody, ApiTags } from '@nestjs/swagger'
import { extendApi } from '@anatine/zod-openapi'
import { createZodDto } from '@anatine/zod-nestjs'

const createAccountBodySchema = extendApi(
  z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string(),
  })
)

const bodyValidationPipe = new ZodValidationPipe(createAccountBodySchema)

export class CreateAccountBodyDto extends createZodDto(
  createAccountBodySchema
) {}

@ApiTags('Auth')
@Controller('/accounts')
@Public()
export class CreateAccountController {
  constructor(private createAccount: CreateAccountUseCase) {}

  @Post()
  @ApiBody({ type: CreateAccountBodyDto })
  async handle(@Body(bodyValidationPipe) body: CreateAccountBodyDto) {
    const { name, email, password } = body

    const result = await this.createAccount.execute({
      email,
      name,
      password,
    })

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case UserAlreadyExistsError:
          throw new ConflictException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }
  }
}
