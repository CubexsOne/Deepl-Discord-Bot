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
	deleteUserSettings,
	hasUserSettings,
	updateUserSettings,
} from '../../database/user-settings'

const COMMAND_NAME = 'language'
const OPTION_NAME = 'target-language'
const SUB_COMMAND_NAMES = { delete: 'delete', set: 'set' }

export function userSettingsCommand(): RESTPostAPIApplicationCommandsJSONBody {
	const command = new SlashCommandBuilder()
		.setName(COMMAND_NAME)
		.setDescription('Manage translation settings')
		.addSubcommand((subcommand) =>
			subcommand
				.setName(SUB_COMMAND_NAMES.set)
				.setDescription('Set your user setting')
				.addStringOption((option) =>
					option
						.setName(OPTION_NAME)
						.setDescription('Select language')
						.setRequired(true)
						.setChoices(availableLanguages),
				),
		)
		.addSubcommand((subcommand) =>
			subcommand.setName(SUB_COMMAND_NAMES.delete).setDescription('Delete your user setting'),
		)

	return command.toJSON()
}

export function setUserSettingsInteraction(client: Client): void {
	client.on(Events.InteractionCreate, async (interaction) => {
		if (!interaction.isChatInputCommand()) return

		if (interaction.commandName !== COMMAND_NAME) return
		const subCommand = interaction.options.getSubcommand()
		if (subCommand !== SUB_COMMAND_NAMES.set) return
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

export function deleteUserSettingsInteraction(client: Client): void {
	client.on(Events.InteractionCreate, async (interaction) => {
		if (!interaction.isChatInputCommand()) return

		if (interaction.commandName !== COMMAND_NAME) return
		const subCommand = interaction.options.getSubcommand()
		if (subCommand !== SUB_COMMAND_NAMES.delete) return
		await interaction.deferReply({ ephemeral: true })

		const userId = interaction.user.id

		try {
			if (await hasUserSettings(userId)) {
				await deleteUserSettings(userId)
			}
		} catch (error) {
			logger.error(error)
			await interaction.editReply({
				content: 'Error when deleting the translation settings!',
			})
			return
		}

		await interaction.editReply({
			content: 'Translation settings deleted successfully!',
		})
	})
}
