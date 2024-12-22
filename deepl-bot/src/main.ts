import * as dotenv from 'dotenv'
import logger from './utils/logger'
dotenv.config()

async function init(): Promise<void> {
	logger.info('Deepl Translator Bot is starting...')
}

init()
