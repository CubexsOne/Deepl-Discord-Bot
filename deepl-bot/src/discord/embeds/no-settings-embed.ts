import { Colors, EmbedBuilder } from 'discord.js'

interface Props {
	serverId: string
	channelId: string
	messageId: string
}

export function createNoSettingsEmbed(props?: Props): EmbedBuilder {
	const embed = new EmbedBuilder()
		.setTitle('No Translation Settings found!')
		.setColor(Colors.Red)
		.addFields({
			name: 'HINT:',
			value: 'You have to set your translation settings on the Server!',
		})
		.addFields({ name: 'Command', value: '`/language <SELECTED LANGUAGE>`' })

	if (props) {
		const { serverId, channelId, messageId } = props
		embed.addFields({
			name: 'Related message:',
			value: `https://discordapp.com/channels/${serverId}/${channelId}/${messageId}`,
		})
	}
	return embed
}
