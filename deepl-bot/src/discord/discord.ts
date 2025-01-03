import {
	ActivityType,
	Client,
	GatewayIntentBits,
	Partials,
	PresenceUpdateStatus,
	REST,
	RESTPostAPIApplicationCommandsJSONBody,
	Routes,
} from 'discord.js'
import { environments } from '../utils/environments'
import logger from '../utils/logger'

const { Guilds, GuildMessages, GuildMessageReactions, GuildPresences, DirectMessages } =
	GatewayIntentBits
const { Channel, Message, Reaction } = Partials

type SlashCommand = RESTPostAPIApplicationCommandsJSONBody
type CommandInteraction = (client: Client) => void
type ButtonInteraction = (client: Client) => void
type BotEvent = (client: Client) => void

export class Discord {
	public static Instance: Discord

	private botToken: string
	private clientId: string
	private clientSecret: string
	private slashCommands: SlashCommand[] = []
	private botEvents: BotEvent[] = []
	private commandInteractions: CommandInteraction[] = []
	private buttonInteractions: ButtonInteraction[] = []

	private client: Client = new Client({
		intents: [DirectMessages, Guilds, GuildMessages, GuildMessageReactions, GuildPresences],
		partials: [Channel, Message, Reaction],
	})

	constructor(botToken: string, clientId: string, clientSecret: string) {
		Discord.Instance = this

		this.botToken = botToken
		this.clientId = clientId
		this.clientSecret = clientSecret
	}

	public static getInstance(): Discord {
		return this.Instance
	}

	public setStatus(
		activityMessage: string,
		status: PresenceUpdateStatus.Online | PresenceUpdateStatus.Invisible,
	): void {
		this.client.user?.setPresence({
			activities: [{ name: activityMessage, type: ActivityType.Custom }],
			status,
		})
	}

	public addSlashCommand(command: SlashCommand): void {
		this.slashCommands.push(command)
	}

	public addBotEvent(botEvent: BotEvent): void {
		this.botEvents.push(botEvent)
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
			this.registerBotEvents()
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

		await rest.put(Routes.applicationGuildCommands(this.clientId, environments.DISCORD_SERVER_ID), {
			body: this.slashCommands,
		})
	}

	private registerBotEvents(): void {
		if (this.botEvents.length === 0) {
			return
		}
		logger.info('Register Bot Events...')
		for (const botEvent of this.botEvents) {
			botEvent(this.client)
		}
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
