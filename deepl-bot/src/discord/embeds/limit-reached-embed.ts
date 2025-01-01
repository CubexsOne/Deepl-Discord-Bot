import { Colors, EmbedBuilder } from 'discord.js'

export function createLimitReachedEmbed(): EmbedBuilder {
	const embed = new EmbedBuilder()
		.setTitle('Translation limit reached')
		.setColor(Colors.Red)
		.addFields({
			name: '\u200B',
			value: 'Translation limit reached for this month.',
		})

	return embed
}
