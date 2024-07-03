import Event from '../../Structures/Event';
import DaBoizClient from '../../Structures/DaBoizClient';
import { EmbedBuilder, ActivityType, Guild, GuildBasedChannel, TextChannel, ColorResolvable } from 'discord.js';

module.exports = class extends Event {

	constructor(client: DaBoizClient) {
		super(client, {
			name: 'ready',
			once: true
		});
	}
	async run() {

		console.log([
			`Logged in as ${this.client.user.tag}`,
			`Loaded ${this.client.commands.size} commands.`,
			`Loaded ${this.client.events.size} events.`,
			`Serving ${this.client.guilds.cache.size} servers.`
		].join('\n'));

		this.client.user.setPresence({ activities: [{ name: `for /help`, type: ActivityType.Watching }], status: 'dnd' })

		this.client.guilds.cache.forEach((guild: Guild) => {
			guild.members.fetch().then()
			if (this.client.guilds.cache.size > 20) return
			console.log(`${guild.name} - ${guild.id}`)
			if (this.client.guilds.cache.size > 12) return
			guild.channels.cache.forEach((channel: GuildBasedChannel) => {
				console.log(` - ${channel.name} ${(channel.type)} ${channel.id}`)
			})
		})

		const onlineEmbed = new EmbedBuilder()
			.setTitle("Now online")
			.setColor(`${this.client.utils.getRandomColor()}` as ColorResolvable)
			.setTimestamp();

		const channel = this.client.channels.cache.get('676803722478747678');
		try {
			const webhooks = await (channel as TextChannel).fetchWebhooks();
			const webhook = webhooks.first();

			await webhook.send({
				username: `${this.client.user.username} Status`,
				avatarURL: `${this.client.user.avatarURL()}`,
				embeds: [onlineEmbed],
			});
		} catch (error) {
			console.error('Error trying to send: ', error.message);
		}

	}
};