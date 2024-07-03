import { CommandInteraction, ApplicationCommandOptionType, EmbedBuilder, CommandInteractionOptionResolver } from 'discord.js';
import Command, { CommandContext } from '../../Structures/Command';
import DaBoizClient from '../../Structures/DaBoizClient';

class HowGayCommand extends Command {
	constructor(client: DaBoizClient) {
		super(client, {
			name: 'howgay',
			description: 'Checks how gay anything is.',
			permissions: ['EmbedLinks'],
			category: 'fun',
			usage: 'howgay [anything]',
			usable: 'Everyone.',
			options: [
				{
					name: 'target',
					type: ApplicationCommandOptionType.String,
					description: 'The thing or person to check',
					required: false
				}
			]
		});
	}

	async run(interaction: CommandInteraction, context: CommandContext): Promise<void> {
		const target = (interaction.options as CommandInteractionOptionResolver).getString('target');
		const userId = interaction.user.id;

		if (target === "@everyone" || target === "@here") {
			await interaction.reply({ content: "Nice try.", ephemeral: true });
			return;
		}

		let whatTheySaid = target || interaction.user.username;
		let personThing = this.client.utils.capitalize(whatTheySaid);

		const howGay = new EmbedBuilder()
			.setColor(`#${Math.floor(Math.random() * 16777215).toString(16)}`)
			.setDescription(`${personThing} is ${Math.floor(Math.random() * 100) + 1}% gay.`);

		await interaction.reply({ embeds: [howGay] });
	}
}

export default HowGayCommand;