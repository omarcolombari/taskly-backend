import {
  BadRequestException,
  Controller,
  Get,
  NotFoundException,
} from '@nestjs/common'
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
import { CurrentUser } from '@/infra/auth/current-user-decorator'
import { GetProfileInformationUseCase } from '@/domain/management/application/use-cases/get-profile-information'
import { UserPayload } from '@/infra/auth/jwt.strategy'
import { UserNotFoundError } from '@/domain/management/application/use-cases/errors/user-not-found-error'
import { extendApi } from '@anatine/zod-openapi'
import { z } from 'zod'
import { createZodDto } from '@anatine/zod-nestjs'
import { ProfilePresenter } from '../presenters/profile-presenter'

const getProfileInformationResponseSchema = extendApi(
  z.object({
    user: extendApi(
      z.object({
        name: z.string(),
        email: z.string().email(),
      })
    ),
  })
)

export class GetProfileInformationResponseDto extends createZodDto(
  getProfileInformationResponseSchema
) {}

@ApiTags('Profile')
@Controller('/profile')
export class GetProfileInformationController {
  constructor(private getProfileInformation: GetProfileInformationUseCase) {}

  @Get()
  @ApiOperation({ operationId: 'getProfileInformation' })
  @ApiResponse({ type: GetProfileInformationResponseDto, status: 200 })
  async handle(@CurrentUser() user: UserPayload) {
    const userId = user.sub

    const result = await this.getProfileInformation.execute({
      userId,
    })

    if (result.isLeft()) {
      const error = result.value

      switch (error.constructor) {
        case UserNotFoundError:
          throw new NotFoundException(error.message)
        default:
          throw new BadRequestException(error.message)
      }
    }

    const profile = result.value.user

    return { user: ProfilePresenter.toHTTP(profile) }
  }
}
