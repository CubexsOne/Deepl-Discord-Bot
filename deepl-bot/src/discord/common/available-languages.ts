type AvailableLanguages = {
	name: string
	value: string
}

export const availableLanguages: AvailableLanguages[] = [
	{ name: 'Portuguese (Brazilian)', value: 'br' },
	{ name: 'German', value: 'de' },
	{ name: 'English (US)', value: 'en-US' },
	{ name: 'English (UK)', value: 'en-GB' },
	{ name: 'Spanish', value: 'es' },
]

export const languageFlags = {
	br: '🇧🇷',
	de: '🇩🇪',
	'en-US': '🇺🇸',
	'en-GB': '🇬🇧',
	es: '🇪🇸',
}
