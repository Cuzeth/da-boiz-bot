import { CommandInteraction, ApplicationCommandOptionType, CommandInteractionOptionResolver } from 'discord.js';
import Command, { CommandContext, CommandOptions } from '../../Structures/Command';
import DaBoizClient from '../../Structures/DaBoizClient';

class UnbanCommand extends Command {
	constructor(client: DaBoizClient) {
		const options: CommandOptions = {
			name: 'unban',
			description: 'Unbans a user **using their user id.**',
			permissions: ['BanMembers'],
			userPermissions: ['BanMembers'],
			modRolePass: true,
			category: 'moderation',
			usage: '/unban <userid>',
			usable: 'Moderators only.',
			options: [
				{
					name: 'userid',
					type: ApplicationCommandOptionType.String,
					description: 'The user ID to unban',
					required: true
				}
			]
		};
		super(client, options);
	}

	async run(interaction: CommandInteraction, context: CommandContext): Promise<void> {
		const userId = (interaction.options as CommandInteractionOptionResolver).getString('userid');

		if (!userId) {
			await interaction.reply({ content: 'Please provide a User ID.', ephemeral: true });
			return;
		}

		if (userId.length !== 18) {
			await interaction.reply({ content: 'Please provide a valid User ID.', ephemeral: true });
			return;
		}

		try {
			const unbannedUser = await interaction.guild?.members.unban(userId, `Unbanned by ${interaction.user.tag} (${interaction.user.id})`);
			if (unbannedUser) {
				await interaction.reply({ content: `Unbanned \`${unbannedUser.tag}\` \`(${unbannedUser.id})\``, ephemeral: true });
			} else {
				await interaction.reply({ content: 'Failed to unban the user. The user might not be banned or an error occurred.', ephemeral: true });
			}
		} catch (err: any) {
			if (err.message === 'Unknown Ban') {
				await interaction.reply({ content: 'This user is not banned.', ephemeral: true });
			} else if (err.message === 'Missing Permissions') {
				await interaction.reply({ content: "I don't have the permissions to do that.", ephemeral: true });
			} else if (err.message === 'Unknown User') {
				await interaction.reply({ content: 'Invalid ID.', ephemeral: true });
			} else if (err.message === 'Request path contains unescaped characters') {
				await interaction.reply({ content: 'Invalid user ID format.', ephemeral: true });
			} else if (err.message.includes('Invalid Form Body')) {
				await interaction.reply({ content: 'Invalid ID.', ephemeral: true });
			} else {
				console.error(err.message);
				await interaction.reply({ content: 'An error occurred while unbanning the user.', ephemeral: true });
			}
		}
	}
}

export default UnbanCommand;