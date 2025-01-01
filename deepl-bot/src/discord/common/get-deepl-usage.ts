import * as deepl from 'deepl-node'
import { environments } from '../../utils'

interface Usage {
	count: number
	limit: number
}
export async function getDeeplUsage(): Promise<Usage> {
	const apiConnection = new deepl.Translator(environments.DEEPL_AUTH_KEY)
	const { character } = await apiConnection.getUsage()

	return { count: character?.count || 0, limit: character?.limit || 0 }
}
