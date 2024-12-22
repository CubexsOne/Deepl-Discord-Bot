import logger from './logger'

interface Environments {
	discordClientId: string
	discordClientSecret: string
	discordToken: string
	deeplAuthKey: string
	nodeEnv: string
}

export const environments: Environments = {
	discordClientId: retrieveEnvironmentValue('DISCORD_CLIENT_ID'),
	discordClientSecret: retrieveEnvironmentValue('DISCORD_CLIENT_SECRET'),
	discordToken: retrieveEnvironmentValue('DISCORD_TOKEN'),
	deeplAuthKey: retrieveEnvironmentValue('DEEPL_AUTH_KEY'),
	nodeEnv: retrieveEnvironmentValue('NODE_ENV'),
}

function retrieveEnvironmentValue(key: string): string {
	const envValue = process.env[key]
	if (envValue === undefined) {
		logger.error(`Environment ${key} not found`)
		return ''
	}
	return envValue
}
