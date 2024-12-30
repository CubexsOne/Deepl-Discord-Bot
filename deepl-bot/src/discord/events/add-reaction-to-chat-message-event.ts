import { Client, Events } from 'discord.js'
import { environments } from '../../utils'

export function addReactionToChatMessageEvent(client: Client): void {
	client.on(Events.MessageCreate, async (message) => {
		if (!environments.DISCORD_CHANNELS_TO_LISTEN.includes(message.channelId)) return
		if (message.author.id === client.user?.id) return

		await message.react('1323285281654312960')
	})
}
