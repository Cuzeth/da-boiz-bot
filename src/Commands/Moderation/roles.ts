import { CommandInteraction, TextChannel } from 'discord.js';
import Command, { CommandContext, CommandOptions } from '../../Structures/Command';
import DaBoizClient from '../../Structures/DaBoizClient';

class RolesCommand extends Command {
	constructor(client: DaBoizClient) {
		const options: CommandOptions = {
			name: 'roles',
			description: 'Displays all server roles.',
			permissions: ['EmbedLinks'],
			userPermissions: ['ManageMessages'],
			modRolePass: true,
			category: 'moderation',
			usage: '/roles',
			usable: 'Moderators only.'
		};
		super(client, options);
	}

	async run(interaction: CommandInteraction, context: CommandContext): Promise<void> {
		const roles = interaction.guild?.roles.cache.map((r: any) => `${r}`).join(' | ');
		if (!roles) {
			await interaction.reply({ content: 'No roles found.', ephemeral: true });
			return;
		}

		const channel = interaction.channel as TextChannel;
		if (!channel) {
			await interaction.reply({ content: 'This command can only be used in a text channel.', ephemeral: true });
			return;
		}

		interaction.reply({ content: "Sent roles.", ephemeral: true })
		this.client.utils.sendEmbeds(roles, channel, "#00FFFF");
	}
}

export default RolesCommand;