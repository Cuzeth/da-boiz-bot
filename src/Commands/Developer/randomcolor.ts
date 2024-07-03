import DaBoizClient from '../../Structures/DaBoizClient';
import Command, { CommandContext, CommandOptions } from '../../Structures/Command';
import { CommandInteraction, ColorResolvable, EmbedBuilder } from 'discord.js';

class RandomColorCommand extends Command {
	constructor(client: DaBoizClient) {
		const options: CommandOptions = {
			name: 'randomcolor',
			description: 'Sends a randomly generated color.',
			category: 'developer',
			cooldown: 1,
			usage: '/randomcolor',
			usable: 'Everyone.',
		};
		super(client, options);
	}

	async run(interaction: CommandInteraction, context: CommandContext): Promise<void> {
		const color = this.client.utils.getRandomColor()
		const embed = new EmbedBuilder().setDescription(color).setColor(color as ColorResolvable);

		await interaction.reply({ embeds: [embed] });
	}
}

export default RandomColorCommand;