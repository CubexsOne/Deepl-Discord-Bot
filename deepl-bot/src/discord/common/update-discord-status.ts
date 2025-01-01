import { PresenceUpdateStatus } from 'discord.js'
import { Discord } from '../discord'

export function limitReachedDiscordStatus() {
	Discord.Instance.setStatus(
		'Translation limit reached for this month.',
		PresenceUpdateStatus.Invisible,
	)
}

export function usageUpdateDiscordStatus(count: number, limit: number) {
	Discord.Instance.setStatus(`Limit: ${count} / ${limit} Charachters`, PresenceUpdateStatus.Online)
}
