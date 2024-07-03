import DaBoizClient from '../../Structures/DaBoizClient';
import Command, { CommandContext, CommandOptions } from '../../Structures/Command';
import { ApplicationCommandOptionType, CommandInteraction, GuildMember } from 'discord.js';
import ms from 'ms';
import moment from 'moment';

class MuteCommand extends Command {
	constructor(client: DaBoizClient) {
		const options: CommandOptions = {
			name: 'mute',
			description: 'Mutes tagged user.',
			permissions: ['EmbedLinks', 'ManageRoles', 'ManageChannels'],
			userPermissions: ['KickMembers'],
			modRolePass: true,
			category: 'moderation',
			usage: '/mute <user> [duration] [reason]',
			usable: 'Moderators only.',
			options: [
				{
					name: 'user',
					type: ApplicationCommandOptionType.User,
					description: 'The user to mute',
					required: true
				},
				{
					name: 'duration',
					type: ApplicationCommandOptionType.String,
					description: 'The duration of the mute',
					required: false
				},
				{
					name: 'reason',
					type: ApplicationCommandOptionType.String,
					description: 'The reason for the mute',
					required: false
				}
			]
		};
		super(client, options);
	}

	duration(string: string): Date | undefined {
		if (!string) return undefined;
		const rawDuration = ms(string);
		if (rawDuration && !isNaN(rawDuration)) return new Date(Date.now() + rawDuration);
		else return undefined;
	}

	async run(interaction: CommandInteraction, context: CommandContext): Promise<void> {
		const userOption = interaction.options.get('user');
		const durationOption = interaction.options.get('duration')?.value as string;
		const reason = interaction.options.get('reason')?.value as string || 'No reason specified';
		const duration = this.duration(durationOption || '');

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
			await interaction.reply({ content: 'I\'m not muting my owner lmao', ephemeral: true });
			return;
		}

		if (member.id === this.client.user?.id) {
			await interaction.reply({ content: 'no', ephemeral: true });
			return;
		}

		try {
			await member.timeout(duration ? duration.getTime() - Date.now() : null, reason);

			const displayMute = duration ? moment.duration(ms(durationOption || '')).humanize() : 'Indefinitely';

			await this.client.emit('modAction', 'mute', interaction.guild, interaction.channel, reason, interaction.user, member, duration, displayMute);
			await interaction.reply({ content: `Muted ${member.user.tag} for: ${reason} (${displayMute})`, ephemeral: false });
		} catch (error) {
			console.error(error);
			await interaction.reply({ content: 'Something went wrong. Check bot\'s permissions and role hierarchy.', ephemeral: true });
		}
	}
}

export default MuteCommand;