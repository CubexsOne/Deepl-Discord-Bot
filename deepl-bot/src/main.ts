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
	botSettingsCommand,
	deleteUserSettingsInteraction,
	setBotSettingsInteraction,
	setUserSettingsInteraction,
	userSettingsCommand,
} from './discord/slash-command'
import * as deepl from 'deepl-node'
import { createBotSettings, hasBotSettings } from './database/bot-settings'
import { limitReachedDiscordStatus, usageUpdateDiscordStatus } from './discord/common'
dotenv.config()

async function addDiscordEvents(bot: Discord) {
	bot.addBotEvent(addReactionToChatMessageEvent)
	bot.addBotEvent(translateMessageOnReactionEvent)
	bot.addBotEvent(leaveInvalidServerEvent)
	bot.addBotEvent(translatePrivateMessages)
}

async function addDiscordSlashCommands(bot: Discord) {
	bot.addSlashCommand(userSettingsCommand())
	bot.addSlashCommand(botSettingsCommand())
}

async function addDiscordCommandInteractions(bot: Discord) {
	bot.addCommandInteraction(setUserSettingsInteraction)
	bot.addCommandInteraction(deleteUserSettingsInteraction)
	bot.addCommandInteraction(setBotSettingsInteraction)
}

async function initializeDiscordStatus() {
	const translator = new deepl.Translator(environments.DEEPL_AUTH_KEY)

	const { character } = await translator.getUsage()
	if (character?.limitReached()) {
		limitReachedDiscordStatus()
	} else {
		usageUpdateDiscordStatus(character?.count || 0, character?.limit || 0)
	}
}

async function init(): Promise<void> {
	const bot = new Discord(
		environments.DISCORD_TOKEN,
		environments.DISCORD_CLIENT_ID,
		environments.DISCORD_CLIENT_SECRET,
	)

	try {
		logger.info('Deepl Translator Bot is starting...')
		if (!(await hasBotSettings())) {
			await createBotSettings()
		}
		await addDiscordEvents(bot)
		await addDiscordSlashCommands(bot)
		await addDiscordCommandInteractions(bot)

		await bot.start()
		await initializeDiscordStatus()
	} catch (error) {
		logger.error(error)
	}
}

init()
