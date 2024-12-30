import * as dotenv from 'dotenv'
import logger from './utils/logger'
import { Discord } from './discord'
import { environments } from './utils'
import {
	addReactionToChatMessageEvent,
	leaveInvalidServerEvent,
	translateMessageOnReactionEvent,
	translatePrivateMessages,
} from './discord/events'
import {
	deleteUserSettingsInteraction,
	setUserSettingsInteraction,
	userSettingsCommand,
} from './discord/slash-command'
import { PresenceUpdateStatus } from 'discord.js'
import * as deepl from 'deepl-node'
import { createBotSettings, getBotSettings, hasBotSettings } from './database/bot-settings'
dotenv.config()

async function addDiscordEvents(bot: Discord): Promise<void> {
	if ((await getBotSettings()).reactionTranslations) {
		bot.addBotEvent(addReactionToChatMessageEvent)
		bot.addBotEvent(translateMessageOnReactionEvent)
	}
	bot.addBotEvent(leaveInvalidServerEvent)
	bot.addBotEvent(translatePrivateMessages)
}

async function addDiscordSlashCommands(bot: Discord): Promise<void> {
	bot.addSlashCommand(userSettingsCommand())
}

async function addDiscordCommandInteractions(bot: Discord): Promise<void> {
	bot.addCommandInteraction(setUserSettingsInteraction)
	bot.addCommandInteraction(deleteUserSettingsInteraction)
}

async function init(): Promise<void> {
	const bot = new Discord(
		environments.DISCORD_TOKEN,
		environments.DISCORD_CLIENT_ID,
		environments.DISCORD_CLIENT_SECRET,
	)
	const translator = new deepl.Translator(environments.DEEPL_AUTH_KEY)

	try {
		logger.info('Deepl Translator Bot is starting...')
		if (!(await hasBotSettings())) {
			await createBotSettings()
		}
		await addDiscordEvents(bot)
		await addDiscordSlashCommands(bot)
		await addDiscordCommandInteractions(bot)

		await bot.start()
		const { character } = await translator.getUsage()
		if (character?.limitReached()) {
			bot.setStatus(
				'Translation limit reached for this month. \nLimit will not be refreshed until the first of the next month',
				PresenceUpdateStatus.Invisible,
			)
		} else {
			bot.setStatus(
				`Limit: ${character?.count} / ${character?.limit} Charachters`,
				PresenceUpdateStatus.Online,
			)
		}
	} catch (error) {
		logger.error(error)
	}
}

init()
