import logger from './logger'

interface Environments {
	DISCORD_AUTHORIZED_USERS: string[]
	DISCORD_SERVER_ID: string
	DISCORD_CHANNELS_TO_LISTEN: string[]
	DISCORD_CLIENT_ID: string
	DISCORD_CLIENT_SECRET: string
	DISCORD_TOKEN: string
	DISCORD_TRANSLATE_EMOJI_ID: string
	DEEPL_AUTH_KEY: string
	NODE_ENV: string
}

export const environments: Environments = {
	DISCORD_AUTHORIZED_USERS: retrieveEnvironmentValueAsArray('DISCORD_AUTHORIZED_USERS'),
	DISCORD_SERVER_ID: retrieveEnvironmentValue('DISCORD_SERVER_ID'),
	DISCORD_CHANNELS_TO_LISTEN: retrieveEnvironmentValueAsArray('DISCORD_CHANNELS_TO_LISTEN'),
	DISCORD_CLIENT_ID: retrieveEnvironmentValue('DISCORD_CLIENT_ID'),
	DISCORD_CLIENT_SECRET: retrieveEnvironmentValue('DISCORD_CLIENT_SECRET'),
	DISCORD_TOKEN: retrieveEnvironmentValue('DISCORD_TOKEN'),
	DISCORD_TRANSLATE_EMOJI_ID: retrieveEnvironmentValue('DISCORD_TRANSLATE_EMOJI_ID'),
	DEEPL_AUTH_KEY: retrieveEnvironmentValue('DEEPL_AUTH_KEY'),
	NODE_ENV: retrieveEnvironmentValue('NODE_ENV'),
}

function retrieveEnvironmentValue(key: string): string {
	const envValue = process.env[key]
	if (envValue === undefined) {
		logger.error(`Environment ${key} not found`)
		return ''
	}
	return envValue
}

function retrieveEnvironmentValueAsArray(key: string): string[] {
	const envValues = process.env[key]
	if (envValues === undefined) {
		logger.error(`Environment ${key} not found`)
		return []
	}

	return envValues.split(',')
}
