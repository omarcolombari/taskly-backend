import {
  BadRequestException,
  Body,
  Controller,
  Post,
  UnauthorizedException,
} from '@nestjs/common'
import { ZodValidationPipe } from '@/infra/http/pipes/zod-validation-pipe'
import { z } from 'zod'
import { AuthenticateUserUseCase } from '@/domain/management/application/use-cases/authenticate-user'
import { WrongCredentialsError } from '@/domain/management/application/use-cases/errors/wrong-credentials-error'
import { Public } from '@/infra/auth/public'
import {
  ApiBearerAuth,
  ApiBody,
  ApiCreatedResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger'
import { extendApi } from '@anatine/zod-openapi'
import { createZodDto } from '@anatine/zod-nestjs'

const authenticateBodySchema = extendApi(
  z.object({
    email: z.string().email(),
    password: z.string(),
  })
)

const authenticateResponse = extendApi(
  z.object({
    access_token: z.string(),
  })
)

export class AuthenticateBodyDto extends createZodDto(authenticateBodySchema) {}
export class AuthenticateResponseDto extends createZodDto(
  authenticateResponse
) {}

const bodyValidationPipe = new ZodValidationPipe(authenticateBodySchema)

@ApiTags('Auth')
@Controller('/sessions')
@Public()
export class AuthenticateController {
  constructor(private authenticateUser: AuthenticateUserUseCase) {}

  @Post()
  @ApiBearerAuth()
  @ApiOperation({ operationId: 'signIn' })
  @ApiBody({ type: AuthenticateBodyDto })
  @ApiCreatedResponse({ type: AuthenticateResponseDto })
  async handle(@Body(bodyValidationPipe) body: AuthenticateBodyDto) {
    const { email, password } = body

    const result = await this.authenticateUser.execute({
      email,
      password,
    })

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case WrongCredentialsError:
          throw new UnauthorizedException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }

    const { accessToken } = result.value

    return {
      access_token: accessToken,
    }
  }
}
