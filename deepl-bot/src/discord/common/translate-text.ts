import * as deepl from 'deepl-node'
import { environments } from '../../utils'

interface TranslationResult {
	translation: string
	successful: boolean
	detectedSourceLang: deepl.SourceLanguageCode | ''
}
export async function translateText(
	message: string,
	targetLanguage: string,
): Promise<TranslationResult> {
	const translator = new deepl.Translator(environments.DEEPL_AUTH_KEY)

	const usage = await translator.getUsage()
	if (usage.character?.limitReached()) {
		return { translation: '', successful: false, detectedSourceLang: '' }
	}

	const { detectedSourceLang, text } = await translator.translateText(
		message,
		null,
		targetLanguage as deepl.TargetLanguageCode,
	)

	return {
		translation: text,
		successful: true,
		detectedSourceLang,
	}
}
