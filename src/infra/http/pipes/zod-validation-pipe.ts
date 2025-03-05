import { type PipeTransform, BadRequestException } from '@nestjs/common'
import { ZodError, type ZodSchema } from 'zod'
import { fromZodError } from 'zod-validation-error'

export class ZodValidationPipe implements PipeTransform {
  constructor(private schema: ZodSchema) {}

  transform(value: unknown) {
    try {
      return this.schema.parse(value)
    } catch (error) {
      if (error instanceof ZodError) {
        throw new BadRequestException({
          message: 'Validação falhou',
          statusCode: 400,
          errors: fromZodError(error),
        })
      }

      throw new BadRequestException('Validação falhou')
    }
    return value
  }
}
