import { Client, Events } from 'discord.js'
import { environments } from '../../utils'
import { getBotSettings } from '../../database/bot-settings'

export function addReactionToChatMessageEvent(client: Client): void {
	client.on(Events.MessageCreate, async (message) => {
		if (!environments.DISCORD_CHANNELS_TO_LISTEN.includes(message.channelId)) return
		if (message.author.id === client.user?.id) return
		if (!(await getBotSettings()).reactionTranslations) return

		await message.react(environments.DISCORD_TRANSLATE_EMOJI_ID)
	})
}
