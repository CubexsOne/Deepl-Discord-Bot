# How to initialize database with prisma (from scratch)

## [Prisma Getting started documentation](https://www.prisma.io/docs/getting-started/setup-prisma)

1. Install prisma in project with `npm i -D prisma`
2. Run `npx prisma init` to generate:
  - `prisma` directory
  - `schema.prisma` file in the `prisma` directory
  - or update an `.env` file with a new variable
3. Add your models to the [schema.prisma][schema.prisma]
4. Run `npx prisma migrate dev --name init` to:
  - migrate the models into database
  - create a SQL file for migrations
  - save in db that this migration got applied
5. Install the prisma-client `npm i @prisma/client` to use prisma in your code
6. Run `npx prisma generate` to create the prisma-files for the client


<!-- File / Directory Links -->
[schema.prisma]: ../../deepl-bot/prisma/schema.prisma