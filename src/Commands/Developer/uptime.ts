import { CommandInteraction, EmbedBuilder } from 'discord.js';
import Command, { CommandContext, CommandOptions } from '../../Structures/Command';
import DaBoizClient from '../../Structures/DaBoizClient';

class UptimeCommand extends Command {
	constructor(client: DaBoizClient) {
		const options: CommandOptions = {
			name: 'uptime',
			description: 'Displays bot uptime.',
			permissions: ['EmbedLinks'],
			category: 'developer',
			usage: 'uptime',
			usable: 'Everyone.'
		};
		super(client, options);
	}

	duration(ms: number): string {
		const days = Math.floor(ms / (24 * 60 * 60 * 1000)).toString();
		const daysms = ms % (24 * 60 * 60 * 1000);
		const hours = Math.floor((daysms) / (60 * 60 * 1000)).toString();
		const hoursms = ms % (60 * 60 * 1000);
		const minutes = Math.floor((hoursms) / (60 * 1000)).toString();
		const minutesms = ms % (60 * 1000);
		const sec = Math.floor((minutesms) / (1000)).toString();
		return `\`${days.padStart(1, '0')}:${hours.padStart(2, '0')}:${minutes.padStart(2, '0')}:${sec.padStart(2, '0')}\``;
	}

	async run(interaction: CommandInteraction, context: CommandContext): Promise<void> {
		const uptimeEmbed = new EmbedBuilder()
			.setTitle('Bot Uptime')
			.setDescription(this.duration(this.client.uptime || 0))
			.setColor('Red');

		await interaction.reply({ embeds: [uptimeEmbed] });
	}
}

export default UptimeCommand;