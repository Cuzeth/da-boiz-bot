import { CommandInteraction, ApplicationCommandOptionType, CommandInteractionOptionResolver, CacheType, EmbedBuilder } from 'discord.js';
import DaBoizClient from '../../Structures/DaBoizClient';
import Command, { CommandContext, CommandOptions } from '../../Structures/Command';

class CareCommand extends Command {
	constructor(client: DaBoizClient) {
		const options: CommandOptions = {
			name: 'howcap',
			description: 'Checks how cap anything is.',
			permissions: ['EmbedLinks'],
			category: 'fun',
			usage: '/howcap [anything]',
			usable: 'Everyone.',
			options: [
				{
					name: 'thing',
					type: ApplicationCommandOptionType.String,
					description: 'The thing to check for cap',
					required: false,
				},
			],
		};
		super(client, options);
	}

	async run(interaction: CommandInteraction, context: CommandContext) {
		if (context.args[0] === "@everyone" || context.args[0] === "@here") return interaction.channel.send("Nice try.");

		let whatTheySaid = context.args.join(" ");
		if (!context.args[0]) whatTheySaid = "That";
		let personThing = this.client.utils.capitalize(whatTheySaid);

		const howCap = new EmbedBuilder()
			.setColor(`#${Math.floor(Math.random() * 16777215).toString(16)}`);
		const determine = `${Math.floor(Math.random() * 100) + 1}%`;
		howCap.setDescription(`${personThing} is ${determine} cap.`);

		interaction.channel.send({ embeds: [howCap] });
	}
};

export default CareCommand;