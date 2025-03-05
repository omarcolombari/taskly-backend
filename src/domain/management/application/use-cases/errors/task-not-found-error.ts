import type { UseCaseError } from '@/core/errors/use-case-error'

export class TaskNotFoundError extends Error implements UseCaseError {
  constructor() {
    super('Tarefa não encontrada')
  }
}
