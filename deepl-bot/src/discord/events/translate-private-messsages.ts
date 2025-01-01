import { ChannelType, Client, Events } from 'discord.js'
import * as timers from 'node:timers/promises'

import logger from '../../utils/logger'
import {
	getDeeplUsage,
	limitReachedDiscordStatus,
	mapLanguageToFlag,
	translateText,
	usageUpdateDiscordStatus,
} from '../common'
import { getUserSettings, hasUserSettings } from '../../database/user-settings'
import { createLimitReachedEmbed, createNoSettingsEmbed, createTranslationEmbed } from '../embeds'

export function translatePrivateMessages(client: Client) {
	client.on(Events.MessageCreate, async (message) => {
		if (message.author.bot) return
		if (message.channel.type !== ChannelType.DM) return

		const author = message.author

		try {
			if (!(await hasUserSettings(author.id))) {
				const message = await author.send({
					embeds: [createNoSettingsEmbed()],
				})
				await timers.setTimeout(10_000)
				await message.delete()
			} else {
				const { targetLanguage } = await getUserSettings(author.id)
				const targetFlag = mapLanguageToFlag(targetLanguage)
				const originalMessage = message.content

				const translation = await translateText(originalMessage, targetLanguage)

				if (!translation.successful) {
					limitReachedDiscordStatus()

					await author.send({ embeds: [createLimitReachedEmbed()] })
					return
				}

				const { count, limit } = await getDeeplUsage()
				usageUpdateDiscordStatus(count, limit)

				const originalFlag = mapLanguageToFlag(translation.detectedSourceLang)
				await author.send({
					embeds: [
						createTranslationEmbed({
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
	})
}
