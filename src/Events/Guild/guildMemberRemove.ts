import Event from '../../Structures/Event';
import { GuildMember, EmbedBuilder, TextChannel } from 'discord.js';
import DaBoizClient from '../../Structures/DaBoizClient';
import mysql from 'mysql2/promise';

module.exports = class extends Event {

	constructor(client: DaBoizClient) {
		super(client, {
			name: 'guildMemberRemove'
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

		const byeMemberEmbed = new EmbedBuilder()
			.setColor("Red")
			.setTitle("Member Left")
			.addFields({ name: "User", value: `<@${user.id}> \`${user.tag}\``, inline: true })
			.setFooter({ text: `User ID: ${user.id}` })
			.setThumbnail(user.avatarURL());

		(memberLogsChannel as TextChannel).send({ embeds: [byeMemberEmbed] }).catch((err: { message: string; }) => {
			if (err.message === "Missing Access") return;
			console.error(err);
		});
	}
};