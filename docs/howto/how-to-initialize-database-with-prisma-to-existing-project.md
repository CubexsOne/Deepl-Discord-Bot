# How to initialize database with prisma (to existing project)

## [Prisma Getting started documentation](https://www.prisma.io/docs/getting-started/setup-prisma)

1. Install prisma in project with `npm i -D prisma`
2. Run `npx prisma init` to generate:
  - `prisma` directory
  - `schema.prisma` file in the `prisma` directory
  - or update an `.env` file with a new variable
3. Run `npx prisma db pull` to generate the models in [schema.prisma][schema.prisma] from the database
  - Check the generated models to follow the [prisma naming conventions](https://www.prisma.io/docs/orm/reference/prisma-schema-reference#naming-conventions-1)
  - sometimes the command generate column-names with uppercase names, adjust them to lowercase
4. Generate the first migration file, also called `baseline`
  - create a migration directory inside the `prisma` directory (e.g. `mkdir prisma/migrations`)
  - create an output directory for the first migration (e.g. `mkdir prisma/migrations/0_init`)
  - Run `npx prisma migrate diff --from-empty --to-schema-datamodel prisma/schema.prisma --script > prisma/migrations/0_init/migration.sql`
5. Set the baseline migration to `applied` with `npx prisma migrate resolve --applied 0_init` because its already in the database
6. Install the prisma-client `npm i @prisma/client` to use prisma in your code
7. Run `npx prisma generate` to create the prisma-files for the client


<!-- File / Directory Links -->
[schema.prisma]: ../../deepl-bot/prisma/schema.prisma