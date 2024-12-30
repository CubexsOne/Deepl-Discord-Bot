import { PrismaClient } from '@prisma/client'
import { environments } from '../utils'

export async function hasBotSettings(): Promise<boolean> {
	const prisma = new PrismaClient()
	const botSettings = await prisma.botSettings.findUnique({
		where: {
			serverId: environments.DISCORD_SERVER_ID,
		},
	})

	await prisma.$disconnect()
	return !!botSettings
}

export async function createBotSettings() {
	const prisma = new PrismaClient()
	await prisma.botSettings.create({
		data: {
			serverId: environments.DISCORD_SERVER_ID,
		},
	})
	await prisma.$disconnect()
}

export async function updateBotSettings(reactionTranslations: boolean) {
	const prisma = new PrismaClient()
	await prisma.botSettings.update({
		where: {
			serverId: environments.DISCORD_SERVER_ID,
		},
		data: {
			reactionTranslations,
		},
	})
	await prisma.$disconnect()
}

export async function deleteUserSettings() {
	const prisma = new PrismaClient()
	await prisma.botSettings.delete({
		where: {
			serverId: environments.DISCORD_SERVER_ID,
		},
	})
	await prisma.$disconnect()
}

export async function getBotSettings() {
	const prisma = new PrismaClient()
	const botSettings = await prisma.botSettings.findUnique({
		where: { serverId: environments.DISCORD_SERVER_ID },
	})

	if (!botSettings) {
		throw new Error(`No BotSettings found for ${environments.DISCORD_SERVER_ID}`)
	}

	return botSettings
}
