import { CommandInteraction, ApplicationCommandOptionType, EmbedBuilder } from 'discord.js';
import Command, { CommandContext, CommandOptions } from '../../Structures/Command';
import DaBoizClient from '../../Structures/DaBoizClient';
const ud = require("relevant-urban");

class UrbanCommand extends Command {
	constructor(client: DaBoizClient) {
		const options: CommandOptions = {
			name: 'urban',
			description: 'Defines a word using the Urban Dictionary. Warning: some definitions might be NSFW.',
			permissions: ['EmbedLinks'],
			category: 'fun',
			usage: '/urban <word>',
			usable: 'Everyone.',
			options: [
				{
					name: 'word',
					type: ApplicationCommandOptionType.String,
					description: 'The word or phrase to define',
					required: true
				}
			]
		};
		super(client, options);
	}

	async run(interaction: CommandInteraction, context: CommandContext): Promise<void> {
		const word = interaction.options.get('word')?.value as string;

		if (!word) {
			await interaction.reply({ content: 'Specify a word or phrase.', ephemeral: true });
			return;
		}

		try {
			const definition = await ud(encodeURI(word));
			if (!definition) {
				await interaction.reply({ content: 'No definition found.', ephemeral: true });
				return;
			}

			const embed = new EmbedBuilder()
				.setTitle(definition.word)
				.setURL(definition.urbanURL)
				.setDescription(definition.definition)
				.setColor(context.maincolor);

			if (definition.example) {
				embed.addFields({ name: 'Example', value: definition.example });
			}

			await interaction.reply({ embeds: [embed] });

		} catch (error) {
			console.error(error);
			await interaction.reply({ content: 'An error occurred while fetching the definition.', ephemeral: true });
		}
	}
}

export default UrbanCommand;