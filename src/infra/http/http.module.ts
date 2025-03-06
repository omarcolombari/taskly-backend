import { Module } from '@nestjs/common'

import { DatabaseModule } from '../database/database.module'
import { CryptographyModule } from '../cryptography/cryptography.module'
import { AuthenticateController } from './controllers/authenticate.controller'
import { AuthenticateUserUseCase } from '@/domain/management/application/use-cases/authenticate-user'
import { CreateAccountController } from './controllers/create-account.controller'
import { CreateAccountUseCase } from '@/domain/management/application/use-cases/create-account'
import { CreateTaskController } from './controllers/create-task.controller'
import { CreateTaskUseCase } from '@/domain/management/application/use-cases/create-task'
import { EditTaskController } from './controllers/edit-task.controller'
import { EditTaskUseCase } from '@/domain/management/application/use-cases/edit-task'
import { CompleteTaskController } from './controllers/complete-task.controller'
import { CompleteTaskUseCase } from '@/domain/management/application/use-cases/complete-task'
import { ListTasksController } from './controllers/list-tasks.controller'
import { ListTasksUseCase } from '@/domain/management/application/use-cases/list-tasks'
import { DeleteTaskController } from './controllers/delete-task.controller'
import { DeleteTaskUseCase } from '@/domain/management/application/use-cases/delete-task'

@Module({
  imports: [DatabaseModule, CryptographyModule],
  controllers: [
    AuthenticateController,
    CreateAccountController,
    CreateTaskController,
    EditTaskController,
    CompleteTaskController,
    ListTasksController,
    DeleteTaskController,
  ],
  providers: [
    AuthenticateUserUseCase,
    CreateAccountUseCase,
    CreateTaskUseCase,
    EditTaskUseCase,
    CompleteTaskUseCase,
    ListTasksUseCase,
    DeleteTaskUseCase,
  ],
})
export class HttpModule {}
