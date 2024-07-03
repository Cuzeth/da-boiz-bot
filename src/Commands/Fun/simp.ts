import { CommandInteraction, ApplicationCommandOptionType, EmbedBuilder } from 'discord.js';
import Command, { CommandContext, CommandOptions } from '../../Structures/Command';
import DaBoizClient from '../../Structures/DaBoizClient';

class SimpCommand extends Command {
	constructor(client: DaBoizClient) {
		const options: CommandOptions = {
			name: 'simp',
			description: 'Checks if a user is a simp.',
			permissions: ['EmbedLinks'],
			category: 'fun',
			usage: '/simp [anything]',
			usable: 'Everyone.',
			options: [
				{
					name: 'input',
					type: ApplicationCommandOptionType.String,
					description: 'The text or user to check',
					required: false
				}
			]
		};
		super(client, options);
	}

	async run(interaction: CommandInteraction, context: CommandContext): Promise<void> {
		const input = interaction.options.get('input')?.value as string;
		let whatTheySaid = input || interaction.user.username;

		if (input === '@everyone' || input === '@here') {
			await interaction.reply({ content: 'Nice try.', ephemeral: true });
			return;
		}

		let personThing = this.client.utils.capitalize(whatTheySaid);
		const isSimp = new EmbedBuilder()
			.setColor(`#${Math.floor(Math.random() * 16777215).toString(16)}`)
			.setDescription(`${personThing} is ${Math.floor(Math.random() * 100) + 1}% simp.`);

		await interaction.reply({ embeds: [isSimp] });
	}
}

export default SimpCommand;