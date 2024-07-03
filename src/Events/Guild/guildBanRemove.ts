import Event from '../../Structures/Event';
import { Guild, EmbedBuilder, TextChannel, User } from 'discord.js';
import DaBoizClient from '../../Structures/DaBoizClient';
import mysql from 'mysql2/promise';

module.exports = class extends Event {

	constructor(client: DaBoizClient) {
		super(client, {
			name: 'guildBanRemove'
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

		const unbanEmbed = new EmbedBuilder()
			.setColor("#ed2618")
			.setAuthor({ name: user.tag, iconURL: user.avatarURL() })
			.setTitle("Member Unbanned")
			.addFields({ name: 'Member', value: `<@!${user.id}> \`${user.tag}\`` })
			.setTimestamp();

		(logsChannel as TextChannel).send({ embeds: [unbanEmbed] }).catch((err: { message: string }) => {
			if (err.message === "Missing Access") return;
			console.error(err);
		});
	}
};