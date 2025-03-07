# Taskly - Backend

Taskly é a API backend para gerenciamento de tarefas, desenvolvida utilizando boas práticas como DDD (Domain-Driven Design) e Clean Architecture. A aplicação expõe endpoints para cadastro de usuários, autenticação e gerenciamento de tarefas.

## 🚀 Tecnologias

Este projeto foi desenvolvido com as seguintes tecnologias:

- [NestJS](https://nestjs.com/) - Framework progressivo para Node.js
- [Prisma](https://www.prisma.io/) - ORM para interação com banco de dados
- [PostgreSQL](https://www.postgresql.org/) - Banco de dados relacional
- [Docker](https://www.docker.com/) - Para conteinerização do PostgreSQL
- [Swagger](https://swagger.io/) - Documentação dos endpoints
- [Vitest](https://vitest.dev/) - Testes unitários e de integração

## 📝 Decisões Técnicas

### Arquitetura e Padrões

O projeto segue os conceitos de **Domain-Driven Design (DDD)** e **Clean Architecture** para garantir escalabilidade e manutenibilidade. Essas escolhas permitem:

- Separar responsabilidades entre camadas, facilitando testes e evolução do sistema.
- Garantir que a lógica de negócio não esteja acoplada a frameworks ou tecnologias específicas.
- Melhor organização do código, reduzindo a complexidade conforme o projeto cresce.

A estrutura do projeto está organizada em:

- **Domain**: Contém entidades, repositórios, regras de negócio e a camada de aplicação (casos de uso), que está dividida entre os domínios.
- **Infra**: Responsável pela persistência de dados e comunicação externa.


## 📋 Pré-requisitos

Antes de iniciar, você precisará ter instalado:

- [Node.js](https://nodejs.org/)
- [pnpm](https://pnpm.io/)
- [Docker](https://www.docker.com/)

## 🔧 Instalação e Execução

1. Clone o repositório:

   ```sh
   git clone https://github.com/omarcolombari/taskly-backend.git
   cd taskly-backend
   ```

2. Instale as dependências:

   ```sh
   pnpm install
   ```

3. Suba o banco de dados PostgreSQL via Docker:

   ```sh
   docker-compose up -d
   ```

4. Configure as variáveis de ambiente:

   Crie um arquivo `.env` na raiz do projeto e adicione:

   ```sh
   DATABASE_URL="postgresql://docker:docker@localhost:5432/taskly?schema=public"
   JWT_SECRET="sua_chave_secreta"
   ```

5. Execute as migrações do Prisma:

   ```sh
   pnpm prisma migrate dev
   ```

6. Inicie a API:

   ```sh
   pnpm start:dev
   ```

## 📝 Testes

O backend está completamente testado com testes unitários e de integração utilizando Vitest.

- Para rodar os testes unitários e e2e:

   ```sh
   pnpm test
   ```
   ```sh
   pnpm test:e2e
   ```

## 📌 Funcionalidades

- Cadastro e autenticação de usuários
- Gerenciamento de tarefas (criação, edição, exclusão, listagem)
- Arquitetura baseada em DDD e Clean Architecture
- Banco de dados PostgreSQL gerenciado via Prisma
- Documentação interativa via Swagger
- Testes unitários e de integração com Vitest

## 📼 Documentação da API

A documentação interativa dos endpoints pode ser acessada após iniciar a API:

```
http://localhost:3333/docs
```

Ou nesse para acessar o schema:
```
http://localhost:3333/docs/json
```
