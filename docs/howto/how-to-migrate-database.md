# How to migrate database

1. Adjust database schema `schema.prisma` in [deepl-bot/prisma/schema.prisma](../../deepl-bot/prisma/schema.prisma)
2. Create database migration with `npx prisma migrate dev --name <MIGRATION COMMENT>`
  - Generates a new sql-file
  - Applies the migration to the database
  - Updates prisma-client