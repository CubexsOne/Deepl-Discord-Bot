import { ChannelType, Client, Colors, EmbedBuilder, Events, PresenceUpdateStatus } from 'discord.js'
import * as deepl from 'deepl-node'
import * as timers from 'node:timers/promises'

import { environments } from '../../utils'
import logger from '../../utils/logger'
import { mapLanguageToFlag } from '../common'
import { getUserSettings, hasUserSettings } from '../../database/user-settings'
import { Discord } from '../discord'
import { createNoSettingsEmbed } from '../embeds'

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

				const translator = new deepl.Translator(environments.DEEPL_AUTH_KEY)

				let usage = await translator.getUsage()
				if (usage.character?.limitReached()) {
					Discord.Instance.setStatus(
						'Translation limit reached for this month. \nLimit will not be refreshed until the first of the next month',
						PresenceUpdateStatus.Invisible,
					)
					await author.send({ embeds: [createLimitReachedEmbed()] })
					return
				}

				const translationResult = await translator.translateText(
					originalMessage || '',
					null,
					targetLanguage as deepl.TargetLanguageCode,
				)
				usage = await translator.getUsage()
				Discord.Instance.setStatus(
					`Limit: ${usage.character?.count} / ${usage.character?.limit} Charachters`,
					PresenceUpdateStatus.Online,
				)

				const originalFlag = mapLanguageToFlag(translationResult.detectedSourceLang)
				await author.send({
					embeds: [
						createTranslationEmbed({
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
	})
}

function createLimitReachedEmbed(): EmbedBuilder {
	const embed = new EmbedBuilder()
		.setTitle('Translation limit reached')
		.setColor(Colors.Red)
		.addFields({
			name: '\u200B',
			value:
				'Translation limit reached for this month. \nLimit will not be refreshed until the first of the next month',
		})

	return embed
}

function createTranslationEmbed(props: {
	originalFlag: string
	targetFlag: string
	originalMessage: string | null
	translatedMessage: string | null
}): EmbedBuilder {
	const { originalFlag, targetFlag, originalMessage, translatedMessage } = props

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

	return embed
}
