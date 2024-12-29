import {
	Client,
	Events,
	RESTPostAPIApplicationCommandsJSONBody,
	SlashCommandBuilder,
} from 'discord.js'
import { availableLanguages } from '../common'

const COMMAND_NAME = 'language'
export function setUserLanguageSlashCommand(): RESTPostAPIApplicationCommandsJSONBody {
	const command = new SlashCommandBuilder()
		.setName(COMMAND_NAME)
		.setDescription('Set language for translation')
		.addStringOption((option) =>
			option
				.setName('language')
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

		// TODO: Add storing value in database

		await interaction.editReply({
			content: 'Language successful set!',
		})
	})
}
