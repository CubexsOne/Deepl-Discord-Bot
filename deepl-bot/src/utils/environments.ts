interface Environments {
	discordClientId: string
	discordClientSecret: string
	discordToken: string
	deeplAuthKey: string
	environment: string
}

export const environments: Environments = {
	discordClientId: retrieveEnvironmentValue('DISCORD_CLIENT_ID'),
	discordClientSecret: retrieveEnvironmentValue('DISCORD_CLIENT_SECRET'),
	discordToken: retrieveEnvironmentValue('DISCORD_TOKEN'),
	deeplAuthKey: retrieveEnvironmentValue('DEEPL_AUTH_KEY'),
	environment: retrieveEnvironmentValue('ENV'),
}

function retrieveEnvironmentValue(key: string): string {
	const envValue = process.env[key]
	if (envValue === undefined) {
		throw new Error(`Environment ${key} not found`)
	}

	return envValue
}
