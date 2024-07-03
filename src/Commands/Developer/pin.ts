import { CommandInteraction, ApplicationCommandOptionType } from 'discord.js';
import Command, { CommandContext, CommandOptions } from '../../Structures/Command';
import DaBoizClient from '../../Structures/DaBoizClient';

class PinCommand extends Command {
	constructor(client: DaBoizClient) {
		const options: CommandOptions = {
			name: 'pin',
			description: 'Pins a message.',
			category: 'developer',
			devOnly: true,
			usage: 'pin <messageId>',
			usable: 'Bot owner only.',
			options: [
				{
					name: 'messageid',
					type: ApplicationCommandOptionType.String,
					description: 'The ID of the message to pin',
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

		const messageId = interaction.options.get('messageid')?.value as string;

		if (!messageId) {
			await interaction.reply({ content: 'You must provide a message ID to pin.', ephemeral: true });
			return;
		}

		try {
			const message = await interaction.channel?.messages.fetch(messageId);

			if (!message) {
				await interaction.reply({ content: 'Message not found.', ephemeral: true });
				return;
			}

			await message.pin();
			await interaction.reply({ content: 'Message pinned successfully.', ephemeral: true });
		} catch (error: any) {
			console.error(error);
			await interaction.reply({ content: 'An error occurred while trying to pin the message.', ephemeral: true });
		}
	}
}

export default PinCommand;