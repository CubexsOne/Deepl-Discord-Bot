import { Client, Colors, EmbedBuilder, Events } from 'discord.js'
import { environments } from '../../utils'
import logger from '../../utils/logger'
import * as timers from 'node:timers/promises'
import { getUserSettings, hasUserSettings } from '../../database/user-settings'
import { mapLanguageToFlag } from '../common'
import * as deepl from 'deepl-node'

export function translateMessageOnReactionEvent(client: Client): void {
	client.on(Events.MessageReactionAdd, async (interaction, user) => {
		if (user.bot) return
		if (interaction.emoji.id !== environments.DISCORD_TRANSLATE_EMOJI_ID) return
		if (!environments.DISCORD_CHANNELS_TO_LISTEN.includes(interaction.message.channelId)) return

		if (interaction.partial) {
			try {
				await interaction.fetch()
			} catch (error) {
				logger.error(error)
			}
		}

		const serverId = environments.DISCORD_SERVER_ID
		const channelId = interaction.message.channelId
		const messageId = interaction.message.id
		try {
			if (!(await hasUserSettings(user.id))) {
				const message = await user.send({
					embeds: [createNoSettingsEmbed(serverId, channelId, messageId)],
				})
				await timers.setTimeout(3_000)
				await message.delete()
			} else {
				const { targetLanguage } = await getUserSettings(user.id)
				const targetFlag = mapLanguageToFlag(targetLanguage)
				const originalMessage = interaction.message.content

				const translator = new deepl.Translator(environments.DEEPL_AUTH_KEY)
				const translationResult = await translator.translateText(
					originalMessage || '',
					null,
					targetLanguage as deepl.TargetLanguageCode,
				)
				const originalFlag = mapLanguageToFlag(translationResult.detectedSourceLang)
				await user.send({
					embeds: [
						createTranslationEmbed({
							serverId,
							channelId,
							messageId,
							originalFlag,
							targetFlag,
							originalMessage,
							translatedMessage: translationResult.text,
						}),
					],
				})
			}
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

function createTranslationEmbed(props: {
	serverId: string
	channelId: string
	messageId: string
	originalFlag: string
	targetFlag: string
	originalMessage: string | null
	translatedMessage: string | null
}): EmbedBuilder {
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
		.addFields({ name: 'Original Message:', value: originalMessage || '\u200B' })
		.addFields({ name: 'Translated Message:', value: translatedMessage || '\u200B' })
		.addFields({
			name: 'Related message:',
			value: `https://discordapp.com/channels/${serverId}/${channelId}/${messageId}`,
		})

	return embed
}
