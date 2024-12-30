type AvailableLanguages = {
	name: string
	value: string
}

export const availableLanguages: AvailableLanguages[] = [
	{ name: 'German', value: 'de' },
	{ name: 'English (US)', value: 'en-US' },
	{ name: 'English (UK)', value: 'en-GB' },
	{ name: 'Spanish', value: 'es' },
	{ name: 'Portuguese (Brazilian)', value: 'pt-BR' },
]

export function mapLanguageToFlag(language: string): string {
	switch (language) {
		case 'de':
			return '🇩🇪'
		case 'en-US':
			return '🇺🇸'
		case 'en-GB':
			return '🇬🇧'
		case 'es':
			return '🇪🇸'
		case 'pt-BR':
			return '🇧🇷'
		default:
			return ''
	}
}
