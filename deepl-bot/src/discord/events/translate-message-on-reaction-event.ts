import { Client, Events } from 'discord.js'
import { environments } from '../../utils'
import logger from '../../utils/logger'
import * as timers from 'node:timers/promises'
import { getUserSettings, hasUserSettings } from '../../database/user-settings'
import {
	getDeeplUsage,
	limitReachedDiscordStatus,
	mapLanguageToFlag,
	translateText,
	usageUpdateDiscordStatus,
} from '../common'
import { createLimitReachedEmbed, createNoSettingsEmbed, createTranslationEmbed } from '../embeds'
import { getBotSettings } from '../../database/bot-settings'

export function translateMessageOnReactionEvent(client: Client): void {
	client.on(Events.MessageReactionAdd, async (interaction, user) => {
		if (user.bot) return
		if (interaction.emoji.id !== environments.DISCORD_TRANSLATE_EMOJI_ID) return
		if (!environments.DISCORD_CHANNELS_TO_LISTEN.includes(interaction.message.channelId)) return
		if (!(await getBotSettings()).reactionTranslations) return

		const serverId = environments.DISCORD_SERVER_ID
		const channelId = interaction.message.channelId
		const messageId = interaction.message.id
		try {
			if (!(await hasUserSettings(user.id))) {
				const message = await user.send({
					embeds: [createNoSettingsEmbed({ serverId, channelId, messageId })],
				})
				await timers.setTimeout(10_000)
				await message.delete()
			} else {
				await interaction.fetch()
				const { targetLanguage } = await getUserSettings(user.id)
				const targetFlag = mapLanguageToFlag(targetLanguage)
				const originalMessage = interaction.message.content!

				const translation = await translateText(originalMessage, targetLanguage)

				if (!translation.successful) {
					limitReachedDiscordStatus()
					await user.send({ embeds: [createLimitReachedEmbed()] })
					return
				}

				const { count, limit } = await getDeeplUsage()
				usageUpdateDiscordStatus(count, limit)

				const originalFlag = mapLanguageToFlag(translation.detectedSourceLang)
				await user.send({
					embeds: [
						createTranslationEmbed({
							serverId,
							channelId,
							messageId,
							originalFlag,
							targetFlag,
							originalMessage,
							translatedMessage: translation.translation,
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
