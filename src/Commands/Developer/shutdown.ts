import { CommandInteraction, ApplicationCommandOptionType } from 'discord.js';
import Command, { CommandContext, CommandOptions } from '../../Structures/Command';
import DaBoizClient from '../../Structures/DaBoizClient';

class ShutdownCommand extends Command {
	constructor(client: DaBoizClient) {
		const options: CommandOptions = {
			name: 'shutdown',
			description: 'Shuts down the bot.',
			category: 'developer',
			// devOnly: true,
			usage: '/shutdown',
			usable: 'Bot owner only.'
		};
		super(client, options);
	}

	async run(interaction: CommandInteraction, context: CommandContext): Promise<void> {
		if (interaction.user.id !== process.env.OWNERID) return

		try {
			await interaction.reply('Shutting down...');
			console.log('Aight imma head out.');
			process.exit();
		} catch (err) {
			await interaction.followUp({ content: "sike im back somethin broke.", ephemeral: true });
			console.log(err);
		}
	}
}

export default ShutdownCommand;