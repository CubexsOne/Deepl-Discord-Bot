# Deepl-Discord-Bot
## Unofficial Deepl translation Discord Bot

### Requirement
#### Local Development
- [NodeJS][https://nodejs.org/en/download] - to the bot on your local machine
- [PostgreSQL Database](https://www.postgresql.org/) - To save data for your bot
- [Docker][https://docs.docker.com/get-started/get-docker/] - If you want to run the bot with docker OR run a database in docker

### How Tos:
- [How to initialize database with prisma from scratch][how-to-initialize-database-with-prisma-from-scratch.md]
- [How to initialize database with prisma to existing project][how-to-initialize-database-with-prisma-to-existing-project]
- [How to migrate database][how-to-migrate-database.md]

### Contributing

Before you start please read the followings:

- [Contributing][contributing]
- [Docs][docs]
- [Howto][howto]

### To run local
1. Copy the `.env.example`-file in the `./deepl-bot` directory
2. Rename the file to `.env`
3. Add all values for the variables
  - DATABASE_URL=`postgresql url to your database`
  - DEEPL_AUTH_KEY=`DEEPL API KEY from` [DeepL][deeplApiKeys]
  - DISCORD_AUTHORIZED_USERS=`List of all user ids that are allowed to change the bot's settings`
  - DISCORD_SERVER_ID=`The server-id the bot should run on, so the bot leaves all server on 'join' new ones`
  - DISCORD_CHANNELS_TO_LISTEN=`List of all channel-ids in which the bot should add the translation-reactions`
  - DISCORD_CLIENT_ID=`Client ID from the 'OAuth2'-Tab from your bot on` [Discord Dev Portal][discordDevPoral]
  - DISCORD_CLIENT_SECRET=`Client Secret from the 'OAuth2'-Tab from your bot on` [Discord Dev Portal][discordDevPoral]
  - DISCORD_TOKEN=`Bot Token from the 'Bot'-Tab from your bot on` [Discord Dev Portal][discordDevPoral]
  - DISCORD_TRANSLATE_EMOJI_ID=`The ID of the emoji to be used for the reactions, this can be from the same server, but also one that was uploaded directly in the bot under the 'Emoji'-tab of your bot on` [Discord Dev Portal][discordDevPoral]
  - NODE_ENV=`'local' or 'prod' to differentiate between the environments and control logging`
4. Run `make dev` in the `./deepl-bot`-directory to run the bot on your machine

### To run on Docker
1. Build the Dockerfile in the root directory
  - To run it locally you need to add all the environments
2. Run docker command `docker run --rm --name deepl-bot -e ... <IMG-NAME>`

### To run on K8s
1. Add values to `deployment.yaml`, `config-map.yaml`, `secret.yaml` and `pull-secret.yaml`
  - Where to get the values from is under `### To run local` step 3
2. If you want to use another namespace you have to update this value in all files (Makefile included)
3. Run `make apply` in the `./deployment-files`-directory to start the simplified deployment (Need access to the k8s via kubectl)
  - Maybe you have to remove the `sudo` from the Makefile command (in the Makefile)

---
Made with 💙 by [CubexsOne][github]

<!-- General Links -->
[github]: https://github.com/CubexsOne
[deeplApiKeys]: https://www.deepl.com/en/your-account/keys
[discordDevPoral]: https://discord.com/developers/applications

<!-- File / Directory Links -->
[contributing]: ./CONTRIBUTING.md
[docs]: ./docs
[howto]: ./docs/howto/
[how-to-initialize-database-with-prisma-from-scratch.md]: ./docs/howto/how-to-initialize-database-with-prisma-from-scratch.md
[how-to-initialize-database-with-prisma-to-existing-project]: ./docs/howto/how-to-initialize-database-with-prisma-to-existing-project
[how-to-migrate-database.md]: ./docs/howto/how-to-migrate-database.md