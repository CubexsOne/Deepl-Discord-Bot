import { Client } from 'discord.js'
import { environments } from '../../utils'
import logger from '../../utils/logger'

export function leaveInvalidServerEvent(client: Client): void {
	client.on('guildCreate', async (guild) => {
		if (guild.id !== environments.DISCORD_SERVER_ID) {
			logger.info(`Leaving ${guild.id} because of invalid server!`)
			await guild.leave()
		}
	})
}
