import DaBoizClient from '../../Structures/DaBoizClient';
import Command, { CommandContext, CommandOptions } from '../../Structures/Command';
import { CommandInteraction } from 'discord.js';

class RandomStringCommand extends Command {
	constructor(client: DaBoizClient) {
		const options: CommandOptions = {
			name: 'randomstring',
			description: 'Sends a randomly generated string.',
			category: 'developer',
			cooldown: 1,
			usage: '/randomstring',
			usable: 'Everyone.',
		};
		super(client, options);
	}

	async run(interaction: CommandInteraction, context: CommandContext): Promise<void> {
		await interaction.reply(makeid());
	}
}

function makeid(): string {
	let text = "";
	const possible = "abcdefghijklmnopqrstuvwxyz0123456789";

	for (let i = 0; i < 7; i++) {
		text += possible.charAt(Math.floor(Math.random() * possible.length));
	}

	return text;
}

export default RandomStringCommand;