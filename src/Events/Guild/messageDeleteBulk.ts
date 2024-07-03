import Event from '../../Structures/Event';
import { EmbedBuilder, AttachmentBuilder, Message, Collection, TextChannel } from 'discord.js';
import DaBoizClient from '../../Structures/DaBoizClient';
import mysql from 'mysql2/promise';

module.exports = class extends Event {

	constructor(client: DaBoizClient) {
		super(client, {
			name: 'messageDeleteBulk'
		});
	}

	async run(messages: Collection<any, Message>) {
		const guild = messages.first().guild;
		if (!guild) return;
		const channel = messages.first().channel;

		const db = this.client.utils.db;
		const guildId = guild.id;

		const [storedSettings]: [any[], mysql.FieldPacket[]] = await db.query('SELECT * FROM guild_settings WHERE gid = ?', [guildId]);

		if (storedSettings.length === 0) return;

		const settings = storedSettings[0];
		const msgLogsChannel = guild.channels.cache.find((channel: TextChannel) => channel.id === settings.chatlogsChannelID);
		if (!msgLogsChannel) return;

		let msgs = '';
		messages.sorted().forEach((message: { createdTimestamp: string | number | Date; author: { username: any; }; content: any; }) => {
			const d = new Date(message.createdTimestamp);
			const date = d.getHours() + ":" + d.getMinutes() + ", " + d.toDateString();
			msgs += `[${date}] ${message.author.username}: ${message.content || "No message content to be displayed."}\n`;
		});
		const messagestxt = new AttachmentBuilder(Buffer.from(msgs), { name: 'purged.txt' });
		let deleteEmbed = new EmbedBuilder()
			.setColor("#F90000")
			.setTitle("**Bulk Delete**")
			.addFields({ name: "Channel", value: `<#${channel.id}>`, inline: true })
			.addFields({ name: "Amount", value: `\`${messages.size || "Error."}\``, inline: true })
			.setTimestamp();
		(msgLogsChannel as TextChannel).send({ embeds: [deleteEmbed], files: [messagestxt] }).catch((err: { message: string; }) => {
			if (err.message === "Invalid Form Body\nembed.fields[2].value: Must be 1024 or fewer in length.") return;
			if (err.message === "Missing Access") return;
			console.error(err);
		});
	}
};