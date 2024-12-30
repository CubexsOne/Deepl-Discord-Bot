import * as dotenv from 'dotenv'
import logger from './utils/logger'
import { Discord } from './discord'
import { environments } from './utils'
import {
	addReactionToChatMessageEvent,
	leaveInvalidServerEvent,
	translateMessageOnReactionEvent,
} from './discord/events'
import { setUserSettingsInteraction, setUserSettingsCommand } from './discord/slash-command'
dotenv.config()

async function addDiscordEvents(bot: Discord): Promise<void> {
	bot.addBotEvent(addReactionToChatMessageEvent)
	bot.addBotEvent(leaveInvalidServerEvent)
	bot.addBotEvent(translateMessageOnReactionEvent)
}

async function addDiscordSlashCommands(bot: Discord): Promise<void> {
	bot.addSlashCommand(setUserSettingsCommand())
}

async function addDiscordCommandInteractions(bot: Discord): Promise<void> {
	bot.addCommandInteraction(setUserSettingsInteraction)
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
