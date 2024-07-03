import DaBoizClient from '../../Structures/DaBoizClient';
import Command, { CommandContext, CommandOptions } from '../../Structures/Command';
import { CommandInteraction, ApplicationCommandOptionType, CommandInteractionOptionResolver, EmbedBuilder } from 'discord.js';

class HowBasedCommand extends Command {
	constructor(client: DaBoizClient) {
		const options: CommandOptions = {
			name: 'howbased',
			description: 'Checks how based anything is.',
			category: 'fun',
			usage: '/howbased [anything]',
			usable: 'Everyone.',
			options: [
				{
					name: 'thing',
					type: ApplicationCommandOptionType.String,
					description: 'The thing to check how based it is',
					required: false,
				},
			],
		};
		super(client, options);
	}

	async run(interaction: CommandInteraction, context: CommandContext): Promise<void> {
		const thing = (interaction.options as CommandInteractionOptionResolver).getString('thing') || "That";
		if (thing === "@everyone" || thing === "@here") {
			await interaction.reply("Nice try.");
			return;
		}

		const personThing = this.client.utils.capitalize(thing);

		const howCap = new EmbedBuilder()
			.setColor(`#${Math.floor(Math.random() * 16777215).toString(16)}`);

		const determine = Math.floor(Math.random() * 100) + 1;
		if (determine < 25) {
			await interaction.reply("based on what");
			return;
		}
		howCap.setDescription(`${personThing} is ${determine}% based.`);
		await interaction.reply({ embeds: [howCap] });
	}
}

export default HowBasedCommand;