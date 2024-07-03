import { ApplicationCommandOptionType, CommandInteractionOptionResolver, TextChannel, User, EmbedBuilder, CommandInteraction } from 'discord.js';
import Command, { CommandContext, CommandOptions } from '../../Structures/Command';
import DaBoizClient from '../../Structures/DaBoizClient';

class BanCommand extends Command {
	constructor(client: DaBoizClient) {
		const options: CommandOptions = {
			name: 'ban',
			description: 'Bans tagged user.',
			permissions: ['EmbedLinks', 'BanMembers'],
			userPermissions: ['BanMembers'],
			modRolePass: true,
			category: 'moderation',
			usage: 'ban <@user> [reason]',
			usable: 'Moderators only.',
			options: [
				{
					name: 'user',
					type: ApplicationCommandOptionType.User,
					description: 'The user to ban',
					required: true
				},
				{
					name: 'reason',
					type: ApplicationCommandOptionType.String,
					description: 'The reason for the ban',
					required: false
				}
			]
		};
		super(client, options);
	}

	async run(interaction: CommandInteraction, context: CommandContext): Promise<void> {
		const bUser = (interaction.options as CommandInteractionOptionResolver).getUser('user');
		const bReason = (interaction.options as CommandInteractionOptionResolver).getString('reason') || 'No reason specified';

		if (!bUser) {
			await interaction.reply({ content: 'Invalid User.', ephemeral: true });
			return;
		}

		try {
			const member = await interaction.guild?.members.fetch(bUser.id);
			if (member) {
				if (member.id === process.env.OWNERID) {
					await interaction.reply({ content: "I'm not banning my owner lmao", ephemeral: true });
					return;
				}

				if (!member.bannable) {
					await interaction.reply({ content: "I can't ban this user. Either they have a higher role than me, or I don't have the `Ban Members` permission.", ephemeral: true });
					return;
				}

				await member.ban({ reason: `Banned by: ${interaction.user.tag} | ${bReason}` });
				await this.client.emit('modAction', 'ban', interaction.guild, interaction.channel as TextChannel, bReason, interaction.user, member, undefined, undefined);
				await interaction.reply({ content: `Successfully banned ${bUser.tag}`, ephemeral: true });
			} else {
				await this.hackban(interaction, bUser, bReason);
			}
		} catch (error: any) {
			if (error.code === 10007) { // Unknown Member error
				await this.hackban(interaction, bUser, bReason);
			} else {
				console.error(error);
				await interaction.reply({ content: 'Something went wrong. What exactly? I have no idea.', ephemeral: true });
			}
		}
	}

	async hackban(interaction: CommandInteraction, user: User, reason: string): Promise<void> {
		try {
			await interaction.guild?.members.ban(user.id, { reason: `Hackbanned by ${interaction.user.tag} | ${reason}` });
			await interaction.reply({ content: `Successfully hackbanned ${user.tag}`, ephemeral: true });

			const GuildSettings = require('../../models/settings');
			const storedSettings = await GuildSettings.findOne({ gid: interaction.guild?.id });
			const modmessage = storedSettings.modmessage;
			const logsChannel = interaction.guild?.channels.cache.find((channel: TextChannel) => channel.id == storedSettings.modlogChannelID);

			let banEmbed = new EmbedBuilder()
				.setColor("#ed2618")
				.setAuthor({ name: modmessage, iconURL: interaction.guild?.iconURL() || '' })
				.setTitle("Member Hackbanned")
				.addFields(
					{ name: 'Member', value: `<@!${user.id}> \`${user.tag}\`` },
					{ name: 'Moderator', value: `<@!${interaction.user.id}> \`${interaction.user.tag}\`` }
				)
				.setTimestamp();

			if (!logsChannel) {
				let noChannel = new EmbedBuilder()
					.setDescription(`Could not find mod logs channel. Please ensure a channel is set. *\`More info on /help events\`*`);
				await interaction.followUp({ embeds: [noChannel], ephemeral: true });
				return;
			}

			(logsChannel as TextChannel).send({ embeds: [banEmbed] }).catch((err: { message: string }) => {
				if (err.message === "Missing Access") return;
				console.error(err);
			});
		} catch (err: any) {
			console.error(err);
			await interaction.followUp({ content: 'An error occurred while hackbanning the user.', ephemeral: true });
		}
	}
}

export default BanCommand;