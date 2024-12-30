import {
	Client,
	Events,
	RESTPostAPIApplicationCommandsJSONBody,
	SlashCommandBuilder,
} from 'discord.js'
import { availableLanguages } from '../common'
import logger from '../../utils/logger'
import {
	createUserSettings,
	hasUserSettings,
	updateUserSettings,
} from '../../database/user-settings'

const COMMAND_NAME = 'language'
const OPTION_NAME = 'target-language'
export function setUserLanguageSlashCommand(): RESTPostAPIApplicationCommandsJSONBody {
	const command = new SlashCommandBuilder()
		.setName(COMMAND_NAME)
		.setDescription('Set language for translation')
		.addStringOption((option) =>
			option
				.setName(OPTION_NAME)
				.setDescription('Select language')
				.setRequired(true)
				.setChoices(availableLanguages),
		)

	return command.toJSON()
}

export function setUserLanguageInteraction(client: Client): void {
	client.on(Events.InteractionCreate, async (interaction) => {
		if (!interaction.isChatInputCommand()) return

		if (interaction.commandName !== COMMAND_NAME) return
		await interaction.deferReply({ ephemeral: true })

		const userId = interaction.user.id
		const targetLanguage = interaction.options.getString(OPTION_NAME)!

		try {
			if (await hasUserSettings(userId)) {
				await updateUserSettings(userId, targetLanguage)
			} else {
				await createUserSettings(userId, targetLanguage)
			}
		} catch (error) {
			logger.error(error)
			await interaction.editReply({
				content: 'Error when setting the translation settings!',
			})
			return
		}

		await interaction.editReply({
			content: 'Translation settings successfully set!',
		})
	})
}
