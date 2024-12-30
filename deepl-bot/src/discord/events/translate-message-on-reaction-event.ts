import { Client, Colors, EmbedBuilder, Events } from 'discord.js'
import { environments } from '../../utils'
import logger from '../../utils/logger'
import * as timers from 'node:timers/promises'

export function translateMessageOnReactionEvent(client: Client): void {
	client.on(Events.MessageReactionAdd, async (interaction, user) => {
		if (user.bot) return
		if (interaction.emoji.id !== environments.DISCORD_TRANSLATE_EMOJI_ID) return
		if (!environments.DISCORD_CHANNELS_TO_LISTEN.includes(interaction.message.channelId)) return

		const serverId = environments.DISCORD_SERVER_ID
		const channeldId = interaction.message.channelId
		const messageId = interaction.message.id

		const hasSettings = true
		try {
			// TODO: Retrieve language to to translate
			// TODO: Translate via deepl and save in cache in database
			// TODO: if user settings not existing, show hint to set settings ✅
			if (!hasSettings) {
				const message = await user.send({
					embeds: [createNoSettingsEmbed(serverId, channeldId, messageId)],
				})
				await timers.setTimeout(3_000)
				await message.delete()
			}

			// TODO: if user settings existing, translate ✅
			if (hasSettings) {
				const message = await user.send({
					embeds: [createTranslationEmbed(serverId, channeldId, messageId, '123', '123')],
				})
				// TODO: REMOVE
				await timers.setTimeout(3_000)
				await message.delete()
			}

			// TODO: Remove reaction after sending translation or hint ✅
		} catch (error) {
			logger.error(error)
		}
		const allReactions = interaction.message.reactions.resolve(
			environments.DISCORD_TRANSLATE_EMOJI_ID,
		)
		await allReactions?.users.remove(user.id)
	})
}

function createNoSettingsEmbed(
	serverId: string,
	channelId: string,
	messageId: string,
): EmbedBuilder {
	const embed = new EmbedBuilder()
		.setTitle('No Translation Settings found!')
		.setColor(Colors.Red)
		.addFields({
			name: 'HINT:',
			value: 'You have to set your translation settings on the Server!',
		})
		.addFields({ name: 'Command', value: '`/language <SELECTED LANGUAGE>`' })
		.addFields({
			name: 'Related message:',
			value: `https://discordapp.com/channels/${serverId}/${channelId}/${messageId}`,
		})

	return embed
}

function createTranslationEmbed(
	serverId: string,
	channelId: string,
	messageId: string,
	originalMessage: string,
	translatedMessage: string,
): EmbedBuilder {
	const embed = new EmbedBuilder()
		.setTitle('Translation')
		.setColor(Colors.Navy)
		.addFields({ name: 'Original Message:', value: originalMessage })
		.addFields({ name: 'Translated Message:', value: translatedMessage })
		.addFields({
			name: 'Related message:',
			value: `https://discordapp.com/channels/${serverId}/${channelId}/${messageId}`,
		})

	return embed
}
