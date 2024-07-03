import { CommandInteraction, ApplicationCommandOptionType } from 'discord.js';
import Command, { CommandContext, CommandOptions } from '../../Structures/Command';
import DaBoizClient from '../../Structures/DaBoizClient';

class WhoWouldWinCommand extends Command {
	constructor(client: DaBoizClient) {
		const options: CommandOptions = {
			name: 'whowouldwin',
			description: 'Find out who would win between two or more people.',
			category: 'fun',
			usage: '/whowouldwin <thing1>, <thing2>, [thing3+]',
			usable: 'Everyone.',
			options: [
				{
					name: 'choices',
					type: ApplicationCommandOptionType.String,
					description: 'The choices separated by commas',
					required: true
				}
			]
		};
		super(client, options);
	}

	async run(interaction: CommandInteraction, context: CommandContext): Promise<void> {
		const choices = interaction.options.get('choices')?.value as string;

		if (!choices) {
			await interaction.reply({ content: 'Please provide at least two arguments separated by a comma. Example: /whowouldwin da boiz, me', ephemeral: true });
			return;
		}

		const optionsArray = choices.trim().split(',').map(choice => choice.trim());

		if (optionsArray.length < 2) {
			await interaction.reply({ content: 'Please provide at least two arguments separated by a comma. Example: /whowouldwin da boiz, me', ephemeral: true });
			return;
		}

		const winner = optionsArray[Math.floor(Math.random() * optionsArray.length)];

		await interaction.reply(`${winner} would win.`);
	}
}

export default WhoWouldWinCommand;