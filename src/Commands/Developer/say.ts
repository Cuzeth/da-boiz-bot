import { CommandInteraction, ApplicationCommandOptionType } from 'discord.js';
import Command, { CommandContext, CommandOptions } from '../../Structures/Command';
import DaBoizClient from '../../Structures/DaBoizClient';

class Say extends Command {
	constructor(client: DaBoizClient) {
		const options: CommandOptions = {
			name: 'say',
			description: 'Says text',
			category: 'developer',
			cooldown: 0.1,
			usage: 'say <text>',
			usable: 'Owner only.',
			options: [
				{
					name: 'text',
					type: ApplicationCommandOptionType.String,
					description: 'Text to say',
					required: true
				}
			]
		};
		super(client, options);
	}

	async run(interaction: CommandInteraction, context: CommandContext): Promise<void> {
		if (interaction.user.id !== process.env.OWNERID) {
			await interaction.reply({ content: 'You do not have permission to use this command.', ephemeral: true });
			return;
		}

		const text = interaction.options.get('text')?.value as string;
		await interaction.reply({ content: 'Message sent!', ephemeral: true });
		await interaction.channel?.send(text);
	}
}

export default Say;