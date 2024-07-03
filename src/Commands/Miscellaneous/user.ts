import { CommandInteraction, GuildMember, EmbedBuilder, ApplicationCommandOptionType, User, CommandInteractionOptionResolver, Role, UserFlagsString } from 'discord.js';
import moment from 'moment';
import Command, { CommandContext, CommandOptions } from '../../Structures/Command';
import DaBoizClient from '../../Structures/DaBoizClient';

const flags: Record<UserFlagsString, string> = {
	Staff: 'Discord Staff',
	Partner: 'Discord Partner',
	Hypesquad: 'HypeSquad Events',
	BugHunterLevel1: 'Bug Hunter (Level 1)',
	BugHunterLevel2: 'Bug Hunter (Level 2)',
	HypeSquadOnlineHouse1: 'House of Bravery',
	HypeSquadOnlineHouse2: 'House of Brilliance',
	HypeSquadOnlineHouse3: 'House of Balance',
	PremiumEarlySupporter: 'Early Supporter',
	TeamPseudoUser: 'Team User',
	VerifiedBot: 'Verified Bot',
	VerifiedDeveloper: 'Verified Bot Developer',
	CertifiedModerator: 'Certified Moderator',
	BotHTTPInteractions: 'HTTP Interactions Bot',
	Spammer: 'Spammer',
	Quarantined: 'Quarantined',
	MFASMS: 'MFA SMS',
	PremiumPromoDismissed: 'Premium Promo Dismissed',
	HasUnreadUrgentMessages: 'Has Unread Urgent Messages',
	DisablePremium: 'Disable Premium',
	RestrictedCollaborator: 'Restricted Collaborator',
	ActiveDeveloper: 'Active Developer',
	Collaborator: 'Collaborator'
};

class UserCommand extends Command {
	constructor(client: DaBoizClient) {
		const options: CommandOptions = {
			name: 'user',
			description: 'Displays a Discord user\'s info.',
			permissions: ['EmbedLinks'],
			category: 'miscellaneous',
			usage: 'user [@user]',
			usable: 'Everyone.',
			options: [
				{
					name: 'user',
					type: ApplicationCommandOptionType.User,
					description: 'The user to get information about',
					required: false
				}
			]
		};
		super(client, options);
	}

	async run(interaction: CommandInteraction, context: CommandContext): Promise<void> {
		try {
			const target: User = (interaction.options as CommandInteractionOptionResolver).getUser('user') || interaction.user;
			const member: GuildMember | null = await interaction.guild?.members.fetch(target.id).catch(() => null);

			if (member) {
				const user = member.user;

				const roles: string[] = member.roles.cache
					.sort((a: Role, b: Role) => b.position - a.position)
					.map((role: Role) => role.toString())
					.slice(0, -1);
				const userFlags: string[] = user.flags?.toArray() || [];

				const embed = new EmbedBuilder()
					.setFooter({ text: this.client.footerName as string, iconURL: context.sicon })
					.setAuthor({ name: user.tag, iconURL: user.avatarURL() })
					.setThumbnail(user.displayAvatarURL({ extension: "png", size: 1024 }))
					.setColor(member.displayHexColor || context.maincolor)
					.addFields(
						{
							name: 'User', value: [
								`**❯ Username:** ${user.username}`,
								`**❯ Nickname:** ${member.displayName || 'No nickname.'}`,
								`**❯ ID:** ${user.id}`,
								`**❯ Flags:** ${userFlags.length ? userFlags.map((flag: UserFlagsString) => flags[flag]).join(', ') : 'None'}`,
								`**❯ Avatar:** [Link to avatar](${user.displayAvatarURL()})`,
								`**❯ Time Created:** ${moment(user.createdTimestamp).format('LT')} ${moment(user.createdTimestamp).format('LL')} (${moment(user.createdTimestamp).fromNow()})`,
								`**❯ Status:** ${this.client.utils.capitalize(member.presence?.status || 'offline')}`
							].join('\n')
						},
						{
							name: 'Member', value: [
								`**❯ Highest Role:** ${member.roles.highest.id === interaction.guild.id ? 'None' : member.roles.highest.name}`,
								`**❯ Server Join Date:** ${moment(member.joinedAt).format('LL LTS')} (${moment(member.joinedAt).fromNow()})`,
								`**❯ Hoist Role:** ${member.roles.hoist ? member.roles.hoist.name : 'None'}`,
								`**❯ Roles [${roles.length}]:** ${roles.length === 0 ? 'None' : roles.length < 11 ? roles.join(', ') : this.client.utils.trimArray(roles)}`,
							].join('\n')
						}
					);
				await interaction.reply({ embeds: [embed] });
			} else {
				const userFlags: string[] = target.flags?.toArray() || [];
				const embed = new EmbedBuilder()
					.setFooter({ text: this.client.footerName as string, iconURL: context.sicon })
					.setAuthor({ name: target.tag, iconURL: target.avatarURL() })
					.setThumbnail(target.displayAvatarURL({ extension: "png", size: 512 }))
					.setColor(context.maincolor)
					.setDescription([
						`**❯ Tag:** <@!${target.id}>`,
						`**❯ Flags:** ${userFlags.length ? userFlags.map((flag: UserFlagsString) => flags[flag]).join(', ') : 'None'}`,
						`**❯ Avatar:** [Link to avatar](${target.displayAvatarURL()})`,
						`**❯ Time Created:** ${moment(target.createdTimestamp).format('LT')} ${moment(target.createdTimestamp).format('LL')} (${moment(target.createdTimestamp).fromNow()})`,
					].join('\n'));
				await interaction.reply({ embeds: [embed] });
			}
		} catch (e) {
			console.error(e);
			await interaction.reply({ content: "Unknown User.", ephemeral: true });
		}
	}
}

export default UserCommand;