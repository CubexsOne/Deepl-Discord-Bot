import {
	Client,
	Events,
	RESTPostAPIApplicationCommandsJSONBody,
	SlashCommandBuilder,
} from 'discord.js'
import { availableLanguages } from '../common'
import { PrismaClient } from '@prisma/client'
import logger from '../../utils/logger'

const COMMAND_NAME = 'language'
const OPTION_NAME = 'target-language'
export function setUserLanguageSlashCommand(): RESTPostAPIApplicationCommandsJSONBody {
	const command = new SlashCommandBuilder()
		.setName(COMMAND_NAME)
		.setDescription('Set language for translation')
		.addStringOption((option) =>
			option
				.setName(OPTION_NAME)
				.setDescription('Select language')
				.setRequired(true)
				.setChoices(availableLanguages),
		)

	return command.toJSON()
}

export function setUserLanguageInteraction(client: Client): void {
	client.on(Events.InteractionCreate, async (interaction) => {
		if (!interaction.isChatInputCommand()) return

		if (interaction.commandName !== COMMAND_NAME) return
		await interaction.deferReply({ ephemeral: true })

		const userId = interaction.user.id
		const targetLanguage = interaction.options.getString(OPTION_NAME)!

		const prisma = new PrismaClient()
		try {
			if (await hasUserSettings(prisma, userId)) {
				await updateUserSettings(prisma, userId, targetLanguage)
			} else {
				await createUserSettings(prisma, userId, targetLanguage)
			}
		} catch (error) {
			logger.error(error)
			await interaction.editReply({
				content: 'Error when setting the translation settings!',
			})
			return
		} finally {
			await prisma.$disconnect()
		}

		await interaction.editReply({
			content: 'Translation settings successfully set!',
		})
	})
}

async function hasUserSettings(prisma: PrismaClient, userId: string): Promise<boolean> {
	const userSettings = await prisma.userSettings.findUnique({
		where: {
			userId,
		},
	})

	return !!userSettings
}

async function createUserSettings(
	prisma: PrismaClient,
	userId: string,
	targetLanguage: string,
): Promise<void> {
	await prisma.userSettings.create({
		data: {
			userId,
			targetLanguage,
		},
	})
}

async function updateUserSettings(
	prisma: PrismaClient,
	userId: string,
	targetLanguage: string,
): Promise<void> {
	await prisma.userSettings.update({
		where: {
			userId,
		},
		data: {
			targetLanguage,
		},
	})
}
