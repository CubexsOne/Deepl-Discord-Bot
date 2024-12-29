import * as dotenv from 'dotenv'
import logger from './utils/logger'
import { Discord } from './discord'
import { environments } from './utils'
import { leaveInvalidServerEvent } from './discord/events'
import { setUserLanguageInteraction, setUserLanguageSlashCommand } from './discord/slash-command'
dotenv.config()

async function addDiscordEvents(bot: Discord): Promise<void> {
	bot.addBotEvent(leaveInvalidServerEvent)
}

async function addDiscordSlashCommands(bot: Discord): Promise<void> {
	bot.addSlashCommand(await setUserLanguageSlashCommand())
}

async function addDiscordCommandInteractions(bot: Discord): Promise<void> {
	bot.addCommandInteraction(setUserLanguageInteraction)
}

async function init(): Promise<void> {
	const bot = new Discord(
		environments.DISCORD_TOKEN,
		environments.DISCORD_CLIENT_ID,
		environments.DISCORD_CLIENT_SECRET,
	)

	try {
		logger.info('Deepl Translator Bot is starting...')
		await addDiscordEvents(bot)
		await addDiscordSlashCommands(bot)
		await addDiscordCommandInteractions(bot)

		await bot.start()
	} catch (error) {
		logger.error(error)
	}
}

init()
