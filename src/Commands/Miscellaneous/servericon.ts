import { CommandInteraction, EmbedBuilder } from 'discord.js';
import Command, { CommandContext, CommandOptions } from '../../Structures/Command';
import DaBoizClient from '../../Structures/DaBoizClient';

class ServerIconCommand extends Command {
	constructor(client: DaBoizClient) {
		const options: CommandOptions = {
			name: 'servericon',
			description: 'Displays server icon.',
			permissions: ['EmbedLinks', 'AttachFiles'],
			category: 'miscellaneous',
			usage: 'servericon',
			usable: 'Everyone.'
		};
		super(client, options);
	}

	async run(interaction: CommandInteraction, context: CommandContext): Promise<void> {
		const guild = interaction.guild;

		if (!guild) {
			await interaction.reply({ content: 'This command can only be used in a server.', ephemeral: true });
			return;
		}

		const iconEmbed = new EmbedBuilder()
			.setTitle(`Server Icon`)
			.setImage(guild.iconURL({ extension: 'png', size: 1024 }) || '')
			.setColor(context.maincolor);

		await interaction.reply({ embeds: [iconEmbed] });
	}
}

export default ServerIconCommand;