import { CommandInteraction, ApplicationCommandOptionType, EmbedBuilder, ColorResolvable } from 'discord.js';
import Command, { CommandContext, CommandOptions } from '../../Structures/Command';
import DaBoizClient from '../../Structures/DaBoizClient';

class SayEmbedCommand extends Command {
	constructor(client: DaBoizClient) {
		const options: CommandOptions = {
			name: 'sayembed',
			description: 'Says text but in embed',
			category: 'developer',
			cooldown: 0.1,
			usage: 'sayembed <color> <text>',
			usable: 'Owner only.',
			options: [
				{
					name: 'color',
					type: ApplicationCommandOptionType.String,
					description: 'The color of the embed',
					required: true
				},
				{
					name: 'text',
					type: ApplicationCommandOptionType.String,
					description: 'The text to say in the embed',
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

		const color = interaction.options.get('color')?.value as ColorResolvable;
		const text = interaction.options.get('text')?.value as string;

		if (!color || !text) {
			await interaction.reply({ content: 'Both color and text are required.', ephemeral: true });
			return;
		}

		const embed = new EmbedBuilder()
			.setDescription(text)
			.setColor(color);

		await interaction.reply({ content: 'Embed sent!', ephemeral: true });
		await interaction.channel?.send({ embeds: [embed] });
	}
}

export default SayEmbedCommand;