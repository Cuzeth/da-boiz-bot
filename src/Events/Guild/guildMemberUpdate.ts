import Event from '../../Structures/Event';
import { GuildMember, EmbedBuilder, TextChannel, AuditLogEvent } from 'discord.js';
import DaBoizClient from '../../Structures/DaBoizClient';
import mysql from 'mysql2/promise';

const donator_role = "579120451079372800";
const donator_roles = [
	'485687224445173762', '488496129579679744', '488501367812653067',
	'506263722512351252', '485712426415947776', '488495733004304394',
];

module.exports = class extends Event {

	constructor(client: DaBoizClient) {
		super(client, {
			name: 'guildMemberUpdate'
		});
	}

	async run(oldMember: GuildMember, newMember: GuildMember) {
		const db = this.client.utils.db;
		const guildId = oldMember.guild.id;
		const userId = newMember.user.id;
		const [storedSettings]: [any[], mysql.FieldPacket[]] = await db.query('SELECT * FROM guild_settings WHERE gid = ?', [guildId]);

		if (storedSettings.length === 0) return;

		const settings = storedSettings[0];
		const guild = oldMember.guild;
		const user = newMember.user;
		const oldUser = oldMember.user;

		// NICKNAME LOGGING
		if (oldMember.nickname !== newMember.nickname) {
			const nickLogsChannel = oldMember.guild.channels.cache.find((channel: TextChannel) => channel.id === settings.nicklogsChannelID);
			if (!nickLogsChannel) return;
			if (!oldMember.guild.members.me.permissionsIn(nickLogsChannel).has(["ViewAuditLog"])) return;

			const fetchedLogs = await guild.fetchAuditLogs({
				limit: 1,
				type: AuditLogEvent.MemberUpdate,
			});
			const nickLog = fetchedLogs.entries.first();
			const { executor } = nickLog;

			if ((newMember.nickname || newMember.user.username) === newMember.user.username) {
				const nickResetEmbed = new EmbedBuilder()
					.setColor("Green")
					.setTitle("Nickname Reset")
					.addFields({ name: "User", value: `<@${user.id}> \`${user.tag}\``, inline: true })
					.addFields({ name: `Old Nickname`, value: `\`${oldMember.nickname || oldUser.username}\`` })
					.setFooter({ text: `User ID: ${user.id}` })
					.setThumbnail(user.avatarURL());

				if (executor.id !== newMember.id) nickResetEmbed.addFields({ name: "Moderator", value: `${executor} \`${executor.tag}\`` });

				return (nickLogsChannel as TextChannel).send({ embeds: [nickResetEmbed] }).catch((err: { message: string; }) => {
					if (err.message === "Missing Access") return;
					if (err.message === "Missing Permissions") return;
					console.error(err);
				});
			}

			const nickChangeEmbed = new EmbedBuilder()
				.setColor("Blue")
				.setTitle("Nickname Changed")
				.addFields({ name: "User", value: `<@${user.id}> \`${user.tag}\`` })
				.addFields({ name: `Old Nickname`, value: `\`${oldMember.nickname || oldUser.username}\``, inline: true })
				.addFields({ name: `New Nickname`, value: `\`${newMember.nickname || newMember.user.username}\``, inline: true })
				.setFooter({ text: `User ID: ${user.id}` })
				.setThumbnail(user.avatarURL());

			if (executor.id !== newMember.id) nickChangeEmbed.addFields({ name: "Moderator", value: `${executor} \`${executor.tag}\`` });

			(nickLogsChannel as TextChannel).send({ embeds: [nickChangeEmbed] }).catch((err: { message: string; }) => {
				if (err.message === "Missing Access") return;
				if (err.message === "Missing Permissions") return;
				console.error(err);
			});
		}

		// ROLE LOGGING
		if (oldMember.roles.cache.size !== newMember.roles.cache.size) {
			// ROLE REMOVED
			if (oldMember.roles.cache.size > newMember.roles.cache.size) {
				const roleLogsChannel = oldMember.guild.channels.cache.find((channel: TextChannel) => channel.id === settings.rolelogsChannelID);
				if (!roleLogsChannel) return;
				if (!oldMember.guild.members.me.permissionsIn(roleLogsChannel).has(["ViewAuditLog"])) return;

				const fetchedLogs = await guild.fetchAuditLogs({
					limit: 1,
					type: AuditLogEvent.MemberRoleUpdate,
				});
				const roleLog = fetchedLogs.entries.first();
				const { executor } = roleLog;

				// Creating an embed message.
				const embed = new EmbedBuilder()
					.setColor("Red")
					.setTitle("Role Removed")
					.addFields({ name: "User", value: `<@${user.id}> \`${user.tag}\``, inline: true })
					.addFields({ name: "Moderator", value: `${executor} \`${executor.tag}\``, inline: true })
					.setFooter({ text: `User ID: ${user.id}` })
					.setThumbnail(user.avatarURL());

				// Looping through the role and checking which role was removed.
				oldMember.roles.cache.forEach((role: { id: any; name: any; }) => {
					if (!newMember.roles.cache.has(role.id)) {
						embed.addFields({ name: "Role", value: `${role} \`${role.name}\`` });
					}
				});

				(roleLogsChannel as TextChannel).send({ embeds: [embed] });
			}

			// ROLE ADDED
			if (oldMember.roles.cache.size < newMember.roles.cache.size) {
				const roleLogsChannel = oldMember.guild.channels.cache.find((channel: TextChannel) => channel.id === settings.rolelogsChannelID);
				if (!roleLogsChannel) return;
				if (!oldMember.guild.members.me.permissionsIn(roleLogsChannel).has(["ViewAuditLog"])) return;

				const fetchedLogs = await guild.fetchAuditLogs({
					limit: 1,
					type: AuditLogEvent.MemberRoleUpdate,
				});
				const roleLog = fetchedLogs.entries.first();
				const { executor } = roleLog;

				// Creating an embed message.
				const embed = new EmbedBuilder()
					.setColor("Blue")
					.setTitle("Role Added")
					.addFields({ name: "User", value: `<@${user.id}> \`${user.tag}\``, inline: true })
					.addFields({ name: "Moderator", value: `${executor} \`${executor.tag}\``, inline: true })
					.setFooter({ text: `User ID: ${user.id}` })
					.setThumbnail(user.avatarURL());

				// Looping through the role and checking which role was added.
				newMember.roles.cache.forEach((role) => {
					if (!oldMember.roles.cache.has(role.id)) {
						embed.addFields({ name: "Role", value: `${role} \`${role.name}\`` });
					}
				});

				(roleLogsChannel as TextChannel).send({ embeds: [embed] });
			}

			// TAILOSIVE SUPPORTER ROLES TT:482026415219408907 TS:636596069421154323
			if (guild.id === "482026415219408907") {
				if (oldMember.roles.cache.size > newMember.roles.cache.size) {
					const dif = oldMember.roles.cache.filter((r: { id: any; }) => !newMember.roles.cache.has(r.id)).first();
					if (!dif) return;
					if (donator_roles.includes(dif.id)) {
						let removeRole = true;
						await newMember.roles.cache.forEach(async (role: any) => {
							if (donator_roles.includes(role)) removeRole = false;
						});
						if (removeRole) await newMember.roles.remove(donator_role);
					}
				} else if (oldMember.roles.cache.size < newMember.roles.cache.size) {
					const dif = newMember.roles.cache.filter((r: { id: any; }) => !oldMember.roles.cache.has(r.id)).first();
					if (!dif) return;
					if (donator_roles.includes(dif.id)) {
						await newMember.roles.add(donator_role);
					}
				}
			}
		}
	}
};