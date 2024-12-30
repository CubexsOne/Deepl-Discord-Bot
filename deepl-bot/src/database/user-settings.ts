import { PrismaClient } from '@prisma/client'

export async function hasUserSettings(userId: string): Promise<boolean> {
	const prisma = new PrismaClient()
	const userSettings = await prisma.userSettings.findUnique({
		where: {
			userId,
		},
	})

	await prisma.$disconnect()
	return !!userSettings
}

export async function createUserSettings(userId: string, targetLanguage: string): Promise<void> {
	const prisma = new PrismaClient()
	await prisma.userSettings.create({
		data: {
			userId,
			targetLanguage,
		},
	})
	await prisma.$disconnect()
}

export async function updateUserSettings(userId: string, targetLanguage: string): Promise<void> {
	const prisma = new PrismaClient()
	await prisma.userSettings.update({
		where: {
			userId,
		},
		data: {
			targetLanguage,
		},
	})
	await prisma.$disconnect()
}

export async function deleteUserSettings(userId: string) {
	const prisma = new PrismaClient()
	await prisma.userSettings.delete({
		where: {
			userId,
		},
	})
	await prisma.$disconnect()
}
