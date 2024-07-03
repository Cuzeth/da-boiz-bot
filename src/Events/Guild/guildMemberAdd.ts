import Event from '../../Structures/Event';
import { GuildMember, EmbedBuilder, TextChannel } from 'discord.js';
import moment from 'moment';
import DaBoizClient from '../../Structures/DaBoizClient';
import mysql from 'mysql2/promise';

module.exports = class extends Event {

	constructor(client: DaBoizClient) {
		super(client, {
			name: 'guildMemberAdd'
		});
	}

	async run(member: GuildMember) {
		const guild = member.guild;
		const user = member.user;

		const db = this.client.utils.db;
		const guildId = guild.id;

		const [storedSettings]: [any[], mysql.FieldPacket[]] = await db.query('SELECT * FROM guild_settings WHERE gid = ?', [guildId]);

		if (storedSettings.length === 0) return;

		const settings = storedSettings[0];
		const memberLogsChannel = guild.channels.cache.find((channel: TextChannel) => channel.id === settings.memberlogsChannelID);
		if (!memberLogsChannel) return;

		const newMemberEmbed = new EmbedBuilder()
			.setColor("Green")
			.setTitle("Member Joined")
			.addFields({ name: "User", value: `<@${user.id}> \`${user.tag}\``, inline: true })
			.addFields({ name: "Created on", value: `${moment.utc(user.createdAt).format("MMM D, YYYY h:mm A")} UTC`, inline: true })
			.setThumbnail(user.avatarURL())
			.setFooter({ text: `User ID: ${user.id}` });

		(memberLogsChannel as TextChannel).send({ embeds: [newMemberEmbed] }).catch((err: { message: string; }) => {
			if (err.message === "Missing Access") return;
			console.error(err);
		});
	}
};