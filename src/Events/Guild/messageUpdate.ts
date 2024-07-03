import Event from '../../Structures/Event';
import { Message, EmbedBuilder, TextChannel } from 'discord.js';
import DaBoizClient from '../../Structures/DaBoizClient';

module.exports = class extends Event {

	constructor(client: DaBoizClient) {
		super(client, {
			name: 'messageUpdate'
		});
	}

	async run(oldMessage: Message, newMessage: Message) {

		if (!oldMessage.content) return;
		if (oldMessage.author.bot) return;
		if (oldMessage.content.length > 1000 || newMessage.content.length > 1000) return;
		if (newMessage.cleanContent == oldMessage.cleanContent) return;

		const db = this.client.utils.db;
		const guildId = newMessage.guild.id;

		const [storedSettings]: [any[], any] = await db.query('SELECT * FROM guild_settings WHERE gid = ?', [guildId]);

		if (storedSettings.length === 0) return;

		const settings = storedSettings[0];
		const msgLogsChannel = newMessage.guild.channels.cache.find((channel: TextChannel) => channel.id === settings.chatlogsChannelID);
		if (!msgLogsChannel) return;

		const user = newMessage.member;
		const editEmbed = new EmbedBuilder()
			.setTitle("**Message Updated**")
			.addFields({ name: "Member", value: `${user} \`${user.user.tag}\``, inline: true })
			.addFields({ name: "Channel", value: `<#${newMessage.channel.id}>`, inline: true })
			.addFields({ name: "Before", value: `\`\`\`${oldMessage.content || "No content."}\`\`\`` })
			.addFields({ name: "After", value: `\`\`\`${newMessage.content}\`\`\`` })
			.setTimestamp();

		(msgLogsChannel as TextChannel).send({ embeds: [editEmbed] }).catch((err: { message: string; }) => {
			if (err.message === "Invalid Form Body") return;
			if (err.message === "Missing Access") return;
			console.error(err);
		});
	}
};