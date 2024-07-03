import Event from '../../Structures/Event';
import { Message, EmbedBuilder, TextChannel } from 'discord.js';
import DaBoizClient from '../../Structures/DaBoizClient';

module.exports = class extends Event {

	constructor(client: DaBoizClient) {
		super(client, {
			name: 'messageDelete'
		});
	}

	async run(message: Message) {
		if (message.content.length > 1024) return;
		if (message.guild == null || message.author.bot) return;

		const db = this.client.utils.db;
		const guildId = message.guild.id;
		const [storedSettings]: [any[], any] = await db.query('SELECT * FROM guild_settings WHERE gid = ?', [guildId]);

		if (storedSettings.length === 0) return;

		const settings = storedSettings[0];
		const msgLogsChannel = message.guild.channels.cache.find((channel: TextChannel) => channel.id === settings.chatlogsChannelID);
		if (!msgLogsChannel) return;

		const user = await message.guild.members.fetch(message.member.id);
		const deleteEmbed = new EmbedBuilder()
			.setColor("#F90000")
			.setTitle("**Message Deleted**")
			.addFields({ name: "Member", value: `${user} \`${user.user.tag}\``, inline: true })
			.addFields({ name: "Channel", value: `<#${message.channel.id}>`, inline: true })
			.addFields({ name: "Message", value: `\`\`\`${message.content || "No content."}\`\`\`` })
			.setTimestamp(message.createdAt);

		if (message.attachments.size !== 0) {
			deleteEmbed.addFields({ name: 'Attachments', value: `\`\`\`${message.attachments.map((e: { proxyURL: any; }) => e.proxyURL).join('\n')}\`\`\`` });
		}

		if (message.reference) {
			deleteEmbed.addFields({ name: 'Replying to', value: `[Message](https://discord.com/channels/${message.reference.guildId}/${message.reference.channelId}/${message.reference.messageId})` });
		}

		(msgLogsChannel as TextChannel).send({ embeds: [deleteEmbed] }).catch((err: { message: string; }) => {
			if (err.message === "Invalid Form Body\nembed.fields[2].value: Must be 1024 or fewer in length.") return;
			if (err.message === "Missing Access") return;
			console.error(err);
		});
	}
}