import DaBoizClient from '../../Structures/DaBoizClient';
import Command, { CommandContext, CommandOptions } from '../../Structures/Command';
import { ApplicationCommandOptionType, CommandInteraction, GuildMember } from 'discord.js';

class UnmuteCommand extends Command {
	constructor(client: DaBoizClient) {
		const options: CommandOptions = {
			name: 'unmute',
			description: 'Unmutes a muted user.',
			permissions: ['EmbedLinks', 'ManageRoles'],
			userPermissions: ['KickMembers'],
			modRolePass: true,
			category: 'moderation',
			usage: '/unmute <user>',
			usable: 'Moderators only.',
			options: [
				{
					name: 'user',
					type: ApplicationCommandOptionType.User,
					description: 'The user to unmute',
					required: true
				}
			]
		};
		super(client, options);
	}

	async run(interaction: CommandInteraction, context: CommandContext): Promise<void> {
		const userOption = interaction.options.get('user');

		if (!userOption) {
			await interaction.reply({ content: 'Invalid User.', ephemeral: true });
			return;
		}

		const member = await interaction.guild?.members.fetch(userOption.value as string).catch(() => null);

		if (!member) {
			await interaction.reply({ content: 'Invalid User.', ephemeral: true });
			return;
		}

		if (member.id === process.env.OWNERID) {
			await interaction.reply({ content: 'I\'m not unmuting my owner lmao', ephemeral: true });
			return;
		}

		if (member.id === this.client.user?.id) {
			await interaction.reply({ content: 'no', ephemeral: true });
			return;
		}

		try {
			await member.timeout(null);

			await this.client.emit('modAction', 'unmute', interaction.guild, interaction.channel, undefined, interaction.user, member, undefined, undefined);
			await interaction.reply({ content: `Unmuted ${member.user.tag}`, ephemeral: false });
		} catch (error) {
			console.error(error);
			await interaction.reply({ content: 'Something went wrong. Check bot\'s permissions and role hierarchy.', ephemeral: true });
		}
	}
}

export default UnmuteCommand;