import {
	Client,
	GatewayIntentBits,
	Partials,
	REST,
	RESTPostAPIApplicationCommandsJSONBody,
	Routes,
} from 'discord.js'
import { environments } from '../utils/environments'
import logger from '../utils/logger'

const { Guilds, GuildMessages, GuildMessageReactions, GuildPresences } = GatewayIntentBits
const { Channel, Message, Reaction } = Partials

type SlashCommand = () => RESTPostAPIApplicationCommandsJSONBody
type CommandInteraction = (client: Client) => void
type ButtonInteraction = (client: Client) => void

export class Discord {
	public readonly Instance: Discord

	private botToken: string
	private clientId: string
	private clientSecret: string
	private slashCommands: SlashCommand[] = []
	private commandInteractions: CommandInteraction[] = []
	private buttonInteractions: ButtonInteraction[] = []

	private client: Client = new Client({
		intents: [Guilds, GuildMessages, GuildMessageReactions, GuildPresences],
		partials: [Channel, Message, Reaction],
	})

	constructor(botToken: string, clientId: string, clientSecret: string) {
		this.Instance = this

		this.botToken = botToken
		this.clientId = clientId
		this.clientSecret = clientSecret
	}

	public addSlashCommand(command: SlashCommand): void {
		this.slashCommands.push(command)
	}

	public addCommandInteraction(interaction: CommandInteraction): void {
		this.commandInteractions.push(interaction)
	}

	public addButtonInteraction(interaction: ButtonInteraction): void {
		this.buttonInteractions.push(interaction)
	}

	public async start(): Promise<void> {
		if (!this.botToken) {
			throw new Error('DC Bot token is missing!')
		}
		if (!this.clientId) {
			throw new Error('DC Auth ID is missing!')
		}
		if (!this.clientSecret) {
			throw new Error('DC Auth Secret is missing!')
		}

		await this.client.login(this.botToken)

		this.client.once('ready', async () => {
			await this.registerSlashCommands()
			this.registerCommandInteractions()
			this.registerButtonInteractions()

			logger.info('Bot is ready!')
		})
	}

	private async registerSlashCommands(): Promise<void> {
		if (this.slashCommands.length === 0) {
			return
		}

		logger.info('Register Slash Commands...')
		const rest = new REST({ version: '10' }).setToken(this.botToken)
		if (environments.NODE_ENV === 'PRODUCTION') {
			await rest.put(Routes.applicationCommands(this.clientId), {
				body: this.slashCommands,
			})
		}

		await rest.put(Routes.applicationGuildCommands(this.clientId, this.clientSecret), {
			body: this.slashCommands,
		})
	}

	private registerCommandInteractions(): void {
		if (this.commandInteractions.length === 0) {
			return
		}

		logger.info('Register Command Interactions...')
		for (const interaction of this.commandInteractions) {
			interaction(this.client)
		}
	}

	private registerButtonInteractions(): void {
		if (this.buttonInteractions.length === 0) {
			return
		}

		logger.info('Register Button Interactions...')
		for (const interaction of this.buttonInteractions) {
			interaction(this.client)
		}
	}
}
