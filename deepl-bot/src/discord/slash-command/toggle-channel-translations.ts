import {
	Client,
	Events,
	RESTPostAPIApplicationCommandsJSONBody,
	SlashCommandBuilder,
} from 'discord.js'
import logger from '../../utils/logger'
import { updateBotSettings } from '../../database/bot-settings'
import { environments } from '../../utils'

const COMMAND_NAME = 'settings'
const OPTION_NAME = 'status'

export function botSettingsCommand(): RESTPostAPIApplicationCommandsJSONBody {
	const command = new SlashCommandBuilder()
		.setName(COMMAND_NAME)
		.setDescription('Toggle channel translations')
		.addStringOption((option) =>
			option
				.setRequired(true)
				.setName(OPTION_NAME)
				.setDescription('Toggle channel translations')
				.setChoices([
					{
						name: 'Enable',
						value: 'true',
					},
					{
						name: 'Disable',
						value: 'false',
					},
				]),
		)

	return command.toJSON()
}

export function setBotSettingsInteraction(client: Client): void {
	client.on(Events.InteractionCreate, async (interaction) => {
		if (!interaction.isChatInputCommand()) return

		if (interaction.commandName !== COMMAND_NAME) return
		await interaction.deferReply({ ephemeral: true })
		if (!environments.DISCORD_AUTHORIZED_USERS.includes(interaction.user.id)) {
			await interaction.editReply({
				content: 'Not authorized!',
			})
			return
		}

		const status = interaction.options.getString(OPTION_NAME)!
		const statusBool = status === 'true' ? true : false

		try {
			await updateBotSettings(statusBool)
		} catch (error) {
			logger.error(error)
			await interaction.editReply({
				content: 'Error when setting the translation settings!',
			})
			return
		}

		await interaction.editReply({
			content: 'Settings successfully set!',
		})
	})
}
