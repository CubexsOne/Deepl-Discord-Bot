import * as dotenv from 'dotenv'
import { environments } from './utils'
dotenv.config()

function init(): void {
	console.log(JSON.stringify(environments, undefined, 2))
}

init()
