import { CommandInteraction, ApplicationCommandOptionType } from 'discord.js';
import DaBoizClient from '../../Structures/DaBoizClient';
import Command, { CommandContext, CommandOptions } from '../../Structures/Command';

class DiceCommand extends Command {
	constructor(client: DaBoizClient) {
		const options: CommandOptions = {
			name: 'dice',
			description: 'Rolls a dice.',
			permissions: ['EmbedLinks'],
			category: 'fun',
			usage: '/dice',
			usable: 'Everyone.',
			options: []
		};
		super(client, options);
	}

	async run(interaction: CommandInteraction, context: CommandContext): Promise<void> {
		const determine = Math.floor(Math.random() * 9) + 1;
		await interaction.reply(`🎲 ${determine}`);
	}
}

export default DiceCommand;