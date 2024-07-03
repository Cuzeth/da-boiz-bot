import { CommandInteraction, ApplicationCommandOptionType, CacheType } from 'discord.js';
import DaBoizClient from '../../Structures/DaBoizClient';
import Command, { CommandContext, CommandOptions } from '../../Structures/Command';
import { EmbedBuilder } from 'discord.js';

class GoatedCommand extends Command {
	constructor(client: DaBoizClient) {
		const options: CommandOptions = {
			name: 'goated',
			description: 'Checks if a user is the goat.',
			permissions: ['EmbedLinks'],
			category: 'fun',
			usage: '/goated [user]',
			usable: 'Everyone.',
			options: [
				{
					name: 'user',
					description: 'The user or thing to check if they are the goat',
					type: ApplicationCommandOptionType.String,
					required: false
				}
			]
		};
		super(client, options);
	}

	async run(interaction: CommandInteraction, context: CommandContext): Promise<void> {
		const userInput = interaction.options.get('user')?.value as string;
		let whatTheySaid = userInput || interaction.user.username;
		let personThing = this.client.utils.capitalize(whatTheySaid);

		const isGoat = new EmbedBuilder()
			.setColor(`#${Math.floor(Math.random() * 16777215).toString(16)}`);
		const determine = Math.round((Math.random() * 1) + 0) === 0;

		if (determine) {
			isGoat.setDescription(`${personThing} is the goat.`);
		} else {
			isGoat.setDescription(`${personThing} is not the goat.`);
		}
		await interaction.reply({ embeds: [isGoat] });
	}
}

export default GoatedCommand;