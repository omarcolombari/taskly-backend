import { Module } from '@nestjs/common'

import { DatabaseModule } from '../database/database.module'
import { CryptographyModule } from '../cryptography/cryptography.module'
import { AuthenticateController } from './controllers/authenticate.controller'
import { AuthenticateUserUseCase } from '@/domain/management/application/use-cases/authenticate-user'
import { CreateAccountController } from './controllers/create-account.controller'
import { CreateAccountUseCase } from '@/domain/management/application/use-cases/create-account'
import { CreateTaskController } from './controllers/create-task.controller'
import { CreateTaskUseCase } from '@/domain/management/application/use-cases/create-task'

@Module({
  imports: [DatabaseModule, CryptographyModule],
  controllers: [
    AuthenticateController,
    CreateAccountController,
    CreateTaskController,
  ],
  providers: [AuthenticateUserUseCase, CreateAccountUseCase, CreateTaskUseCase],
})
export class HttpModule {}
