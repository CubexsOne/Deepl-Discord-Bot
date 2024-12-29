import * as dotenv from 'dotenv'
import logger from './utils/logger'
import { Discord } from './discord'
import { environments } from './utils'
import { leaveInvalidServerEvent } from './discord/events'
import { setUserLanguage } from './discord/slash-command'
dotenv.config()

function addDiscordEvents(bot: Discord): void {
	bot.addBotEvent(leaveInvalidServerEvent)
}

async function addDiscordSlashCommands(bot: Discord): Promise<void> {
	bot.addSlashCommand(await setUserLanguage())
}

async function init(): Promise<void> {
	const bot = new Discord(
		environments.DISCORD_TOKEN,
		environments.DISCORD_CLIENT_ID,
		environments.DISCORD_CLIENT_SECRET,
	)

	try {
		logger.info('Deepl Translator Bot is starting...')
		addDiscordEvents(bot)
		await addDiscordSlashCommands(bot)

		await bot.start()
	} catch (error) {
		logger.error(error)
	}
}

init()
