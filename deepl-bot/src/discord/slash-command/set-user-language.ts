import { RESTPostAPIApplicationCommandsJSONBody, SlashCommandBuilder } from 'discord.js'
import { availableLanguages } from '../common'

export async function setUserLanguage(): Promise<RESTPostAPIApplicationCommandsJSONBody> {
	const command = new SlashCommandBuilder()
		.setName('language')
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
