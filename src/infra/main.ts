import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { EnvService } from './env/env.service'
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger'
import { patchNestjsSwagger } from '@anatine/zod-nestjs'

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true })
  const envService = app.get(EnvService)

  patchNestjsSwagger()

  const port = envService.get('PORT')
  const config = new DocumentBuilder()
    .setTitle('Tasks API')
    .setDescription('API para gerenciamento de tarefas')
    .setVersion('1.0')
    .build()

  const documentFactory = () => SwaggerModule.createDocument(app, config)

  SwaggerModule.setup('api', app, documentFactory, {
    jsonDocumentUrl: 'api/json',
  })

  await app.listen(port)
}

bootstrap()
