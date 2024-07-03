import { CommandInteraction, EmbedBuilder, Colors } from 'discord.js';
import Command, { CommandContext, CommandOptions } from '../../Structures/Command';
import DaBoizClient from '../../Structures/DaBoizClient';

class Ping extends Command {
	constructor(client: DaBoizClient) {
		const options: CommandOptions = {
			name: 'ping',
			description: 'Displays bot ping.',
			permissions: ['EmbedLinks'],
			cooldown: 0.1,
			category: 'developer',
			usage: 'ping',
			usable: 'Everyone.',
			options: []
		};
		super(client, options);
	}

	async run(interaction: CommandInteraction, context: CommandContext): Promise<void> {
		await interaction.deferReply();

		const ping = Date.now() - interaction.createdTimestamp;

		const pingEmbed = new EmbedBuilder()
			.setTitle('🏓 Pong!')
			.addFields(
				{ name: 'Bot Latency:', value: `\`${ping}ms\`` },
				{ name: 'API Latency:', value: `\`${Math.round(this.client.ws.ping)}ms\`` }
			)
			.setColor(Colors.Red);

		await interaction.editReply({ embeds: [pingEmbed] });
	}
}

export default Ping;