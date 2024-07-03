import Event from '../../Structures/Event';
import { Guild, EmbedBuilder, TextChannel, User, AuditLogEvent } from 'discord.js';
import DaBoizClient from '../../Structures/DaBoizClient';
import mysql from 'mysql2/promise';

module.exports = class extends Event {

	constructor(client: DaBoizClient) {
		super(client, {
			name: 'guildBanAdd'
		});
	}

	async run(guild: Guild, user: User) {
		const db = this.client.utils.db;
		const guildId = guild.id;

		const [storedSettings]: [any[], mysql.FieldPacket[]] = await db.query('SELECT * FROM guild_settings WHERE gid = ?', [guildId]);

		if (storedSettings.length === 0) return;

		const settings = storedSettings[0];
		const logsChannel = guild.channels.cache.find((channel: TextChannel) => channel.id === settings.modlogChannelID);
		if (!logsChannel) return;

		if (!guild.members.me.permissionsIn(logsChannel).has(["ViewAuditLog"])) return;

		const fetchedLogs = await guild.fetchAuditLogs({
			limit: 1,
			type: AuditLogEvent.MemberBanAdd,
		});
		const banLog = fetchedLogs.entries.first();
		const { executor } = banLog;
		if (executor.id === this.client.user.id) return;

		const banEmbed = new EmbedBuilder()
			.setColor("#ed2618")
			.setAuthor({ name: user.tag, iconURL: user.avatarURL() })
			.setTitle("Member Banned")
			.addFields({ name: 'Member', value: `<@!${user.id}> \`${user.tag}\`` })
			.setTimestamp();

		if (executor) banEmbed.addFields({ name: "Moderator", value: `<@!${executor.id}> \`${executor.tag}\`` });
		if (banLog.reason) banEmbed.addFields({ name: "Reason", value: `\`${banLog.reason}\`` });

		(logsChannel as TextChannel).send({ embeds: [banEmbed] }).catch((err: { message: string; }) => {
			if (err.message === "Missing Access") return;
			console.error(err);
		});
	}
};