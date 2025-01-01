import { Colors, EmbedBuilder } from 'discord.js'

interface Props {
	serverId?: string
	channelId?: string
	messageId?: string
	originalFlag: string
	targetFlag: string
	originalMessage: string | null
	translatedMessage: string | null
}

export function createTranslationEmbed(props: Props): EmbedBuilder {
	const {
		serverId,
		channelId,
		messageId,
		originalFlag,
		targetFlag,
		originalMessage,
		translatedMessage,
	} = props

	const embed = new EmbedBuilder()
		.setTitle(`Translation (${originalFlag} -> ${targetFlag})`)
		.setColor(Colors.Navy)
		.addFields({
			name: 'Original Message:',
			value: `\`\`\`${originalMessage || '\u200B'}\`\`\``,
		})
		.addFields({
			name: 'Translated Message:',
			value: `\`\`\`${translatedMessage || '\u200B'}\`\`\``,
		})
	if (serverId && channelId && messageId) {
		embed.addFields({
			name: 'Related message:',
			value: `https://discordapp.com/channels/${serverId}/${channelId}/${messageId}`,
		})
	}

	return embed
}
