import { CommandInteraction, ApplicationCommandOptionType, CommandInteractionOptionResolver, GuildMember, TextChannel } from 'discord.js';
import Command, { CommandContext, CommandOptions } from '../../Structures/Command';
import DaBoizClient from '../../Structures/DaBoizClient';

class KickCommand extends Command {
	constructor(client: DaBoizClient) {
		const options: CommandOptions = {
			name: 'kick',
			description: 'Kicks tagged user.',
			permissions: ['EmbedLinks', 'KickMembers'],
			userPermissions: ['KickMembers'],
			modRolePass: true,
			category: 'moderation',
			usage: 'kick <@user> [reason]',
			usable: 'Moderators only.',
			options: [
				{
					name: 'user',
					type: ApplicationCommandOptionType.User,
					description: 'The user to kick',
					required: true
				},
				{
					name: 'reason',
					type: ApplicationCommandOptionType.String,
					description: 'The reason for the kick',
					required: false
				}
			]
		};
		super(client, options);
	}

	async run(interaction: CommandInteraction, context: CommandContext): Promise<void> {
		const kUser = (interaction.options as CommandInteractionOptionResolver).getUser('user');
		const kReason = (interaction.options as CommandInteractionOptionResolver).getString('reason') || 'No reason specified';

		if (!kUser) {
			await interaction.reply({ content: 'Invalid User.', ephemeral: true });
			return;
		}

		const member = await interaction.guild?.members.fetch(kUser.id);
		if (!member) {
			await interaction.reply({ content: 'Invalid User.', ephemeral: true });
			return;
		}

		if (member.id === process.env.OWNERID) {
			await interaction.reply({ content: "I'm not kicking my owner lmao", ephemeral: true });
			return;
		}

		if (!member.kickable) {
			await interaction.reply({ content: "I can't kick this user. Either they have a higher role than me, or I don't have the `Kick Members` permission.", ephemeral: true });
			return;
		}

		try {
			await member.kick(`Kicked by: ${interaction.user.tag} | ${kReason}`);
			await this.client.emit('modAction', 'kick', interaction.guild, interaction.channel as TextChannel, kReason, interaction.user, member, undefined, undefined);
			await interaction.reply({ content: `Successfully kicked ${kUser.tag}`, ephemeral: true });
		} catch (error) {
			console.error(error);
			await interaction.reply({ content: 'Something went wrong. What exactly? I have no idea.', ephemeral: true });
		}
	}
}

export default KickCommand;