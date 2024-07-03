import DaBoizClient from '../../Structures/DaBoizClient';
import Command, { CommandContext, CommandOptions } from '../../Structures/Command';
import { CommandInteraction } from 'discord.js';

class MemoryCommand extends Command {
	constructor(client: DaBoizClient) {
		const options: CommandOptions = {
			name: 'memory',
			description: 'Displays memory info.',
			category: 'developer',
			devOnly: true,
			usage: '/memory',
			usable: 'Bot owner only.',
		};
		super(client, options);
	}

	async run(interaction: CommandInteraction, context: CommandContext): Promise<void> {
		if (interaction.user.id !== process.env.OWNERID) {
			await interaction.reply({ content: 'You do not have permission to use this command.', ephemeral: true });
			return;
		}

		let string = ``;
		const used: any = process.memoryUsage();
		for (let key in used) {
			string += `\`${key} ${Math.round(used[key] / 1024 / 1024 * 100) / 100} MB\`\n`;
		}

		await interaction.reply(string);
	}
}

export default MemoryCommand;