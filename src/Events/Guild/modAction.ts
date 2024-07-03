import { Guild, GuildMember, EmbedBuilder, TextChannel, User } from 'discord.js';
import DaBoizClient from '../../Structures/DaBoizClient';
import Event from '../../Structures/Event';

module.exports = class extends Event {

	constructor(client: DaBoizClient) {
		super(client, {
			name: 'modAction'
		});
	}

	async run(actionType: string, guild: Guild, channel: TextChannel, reason: any, moderator: User, member: GuildMember, duration: Date, displayMute: string) {

		const [storedSettings] = await this.client.utils.db.query('SELECT * FROM guild_settings WHERE gid = ?', [guild.id]);
		const modmessage = (storedSettings as any[])[0].modmessage;
		const logsChannel = guild.channels.cache.find((channel: TextChannel) => channel.id == (storedSettings as any[])[0].modlogChannelID);
		const sicon = guild.iconURL();

		if (actionType === "warn") {
			const wUser = member;
			const wReason = reason;

			const [existingStrikes] = await this.client.utils.db.query('SELECT * FROM strikes WHERE guildID = ? AND userID = ?', [guild.id, wUser.id]);
			let strikeCount = 1;
			if ((existingStrikes as any[]).length > 0) {
				strikeCount = (existingStrikes as any[])[0].strikeCount + 1;
				await this.client.utils.db.query('UPDATE strikes SET strikeCount = ? WHERE guildID = ? AND userID = ?', [strikeCount, guild.id, wUser.id]);
			} else {
				await this.client.utils.db.query('INSERT INTO strikes (guildID, userID, strikeCount) VALUES (?, ?, ?)', [guild.id, wUser.id, strikeCount]);
			}

			const [result] = await this.client.utils.db.query('INSERT INTO cases (guildID, userID, modID, type, reason) VALUES (?, ?, ?, ?, ?)', [guild.id, wUser.id, moderator.id, 'Warn', wReason]);

			const caseId = (result as any).insertId;

			wUser.send(`You were warned in \`${guild.name}\` for \`${wReason}\`\n**Strike Count:** \`${strikeCount}\`\n\`Case ID: ${caseId}\``)
				.catch((err: { message: string; }) => {
					if (err.message === "Cannot send messages to this user") return channel.send("Couldn't DM the user.");
					console.log(err.message);
				});

			let successEmbed = new EmbedBuilder()
				.setColor("Red")
				.setDescription(`Warned \`${wUser.user.tag}\` | **${modmessage}**`);
			channel.send({ embeds: [successEmbed] });

			if (!logsChannel) {
				let noChannel = new EmbedBuilder()
					.setDescription(`Could not find mod logs channel. Please ensure a channel is set. *\`More info on /help events\`*`);
				return channel.send({ embeds: [noChannel] });
			}

			const user = wUser.user;
			let warnEmbed = new EmbedBuilder()
				.setColor("#FFFF00")
				.setAuthor({ name: modmessage, iconURL: sicon })
				.addFields({
					name: 'Member Warned', value: [
						`❯ **Member:** <@${wUser.id}> \`${user.tag}\``,
						`❯ **Moderator:** <@${moderator.id}> \`${moderator.tag}\``,
						`❯ **Reason:** \`${wReason}\``,
						`❯ **Strike Count:** \`${strikeCount}\``
					].join('\n')
				})
				.setFooter({ text: `Case ID: ${caseId}` })
				.setTimestamp();
			(logsChannel as TextChannel).send({ embeds: [warnEmbed] }).catch((err: { message: string; }) => {
				if (err.message === "Missing Access") return;
				console.error(err);
			});

		}

		if (actionType === "mute") {
			const tomute = member;
			const muteReason = reason;

			const [existingStrikes] = await this.client.utils.db.query('SELECT * FROM strikes WHERE guildID = ? AND userID = ?', [guild.id, tomute.id]);
			let strikeCount = 2;
			if ((existingStrikes as any[]).length > 0) {
				strikeCount = (existingStrikes as any[])[0].strikeCount + 2;
				await this.client.utils.db.query('UPDATE strikes SET strikeCount = ? WHERE guildID = ? AND userID = ?', [strikeCount, guild.id, tomute.id]);
			} else {
				await this.client.utils.db.query('INSERT INTO strikes (guildID, userID, strikeCount) VALUES (?, ?, ?)', [guild.id, tomute.id, strikeCount]);
			}

			const [result] = await this.client.utils.db.query('INSERT INTO cases (guildID, userID, modID, type, duration, reason) VALUES (?, ?, ?, ?, ?, ?)', [guild.id, tomute.id, moderator.id, 'Mute', duration, muteReason]);

			const caseId = (result as any).insertId;

			let successEmbed = new EmbedBuilder()
				.setColor("Red")
				.setDescription(`Muted \`${tomute.user.tag}\` | **${modmessage}**`);
			channel.send({ embeds: [successEmbed] });

			if (!logsChannel) {
				let noChannel = new EmbedBuilder()
					.setDescription(`Could not find mod logs channel. Please ensure a channel is set. *\`More info on /help events\`*`);
				return channel.send({ embeds: [noChannel] });
			}

			const user = tomute.user;
			let muteEmbed = new EmbedBuilder()
				.setColor("#ed2618")
				.setAuthor({ name: modmessage, iconURL: sicon })
				.addFields({
					name: "Member Muted", value: [
						`❯ **Member:** <@${tomute.id}> \`${user.tag}\``,
						`❯ **Moderator:** <@${moderator.id}> \`${moderator.tag}\``,
						`❯ **Reason:** \`${muteReason}\``,
						`❯ **Duration:** \`${displayMute || 'Not set'}\``,
						`❯ **Strike Count:** \`${strikeCount}\``
					].join('\n')
				})
				.setFooter({ text: `Case ID: ${caseId}` })
				.setTimestamp();
			(logsChannel as TextChannel).send({ embeds: [muteEmbed] }).catch((err: { message: string; }) => {
				if (err.message === "Missing Access") return;
				console.error(err);
			});
			tomute.send(`You were muted in \`${guild.name}\` for \`${muteReason}\`\n**Duration:** \`${displayMute || 'Not set'}\`\n**Strike Count:** \`${strikeCount}\`\n\`Case ID: ${caseId}\``)
				.catch((err: { message: string; }) => {
					if (err.message === "Cannot send messages to this user") return channel.send("Couldn't DM the user.");
					console.log(err.message);
				});
		}

		if (actionType === "unmute") {
			const toUnMute = member;

			if (channel) {

				let successEmbed = new EmbedBuilder()
					.setColor("Green")
					.setDescription(`Unmuted \`${toUnMute.user.tag}\` | **${modmessage}**`);
				channel.send({ embeds: [successEmbed] });

				if (!logsChannel) {
					let noChannel = new EmbedBuilder()
						.setDescription(`Could not find mod logs channel. Please ensure a channel is set. *\`More info on /help events\`*`);
					return channel.send({ embeds: [noChannel] });
				}

			}

			if (!logsChannel) return;
			const user = toUnMute.user;
			let unMuteEmbed = new EmbedBuilder()
				.setColor("Green")
				.setAuthor({ name: modmessage, iconURL: sicon })
				.addFields({
					name: "Member Unmuted", value: [
						`❯ **Member:** <@${toUnMute.id}> \`${user.tag}\``,
						`❯ **Moderator:** <@${moderator.id}> \`${moderator.tag}\``
					].join('\n')
				})
				.setTimestamp();
			(logsChannel as TextChannel).send({ embeds: [unMuteEmbed] }).catch((err: { message: string; }) => {
				if (err.message === "Missing Access") return;
				console.error(err);
			});

		}

		if (actionType === "ban") {
			const bUser = member;
			const bReason = reason;
			let successEmbed = new EmbedBuilder()
				.setColor("Red")
				.setDescription(`Banned \`${bUser.user.tag}\` | **${modmessage}**`);
			channel.send({ embeds: [successEmbed] });
			bUser.send(`You were banned in \`${guild.name}\` for \`${bReason}\``)
				.catch((err: { message: string; }) => {
					if (err.message === "Cannot send messages to this user") return channel.send("Couldn't DM the user.");
					console.log(err.message);
				});

			if (!logsChannel) {
				let noChannel = new EmbedBuilder()
					.setDescription(`Could not find mod logs channel. Please ensure a channel is set. *\`More info on /help events\`*`);
				return channel.send({ embeds: [noChannel] });
			}

			const user = bUser.user;
			let banEmbed = new EmbedBuilder()
				.setColor("#ed2618")
				.setAuthor({ name: modmessage, iconURL: sicon })
				.addFields({
					name: 'Member Banned', value: [
						`❯ **Member:** <@${bUser.id}> \`${user.tag}\``,
						`❯ **Moderator:** <@${moderator.id}> \`${moderator.tag}\``,
						`❯ **Reason:** \`${bReason}\``
					].join('\n')
				})
				.setTimestamp();
			(logsChannel as TextChannel).send({ embeds: [banEmbed] }).catch((err: { message: string; }) => {
				if (err.message === "Missing Access") return;
				console.error(err);
			});
		}

		if (actionType === "kick") {
			const kUser = member;
			const kReason = reason;
			let successEmbed = new EmbedBuilder()
				.setColor("Red")
				.setDescription(`Kicked \`${kUser.user.tag}\` | **${modmessage}**`);
			channel.send({ embeds: [successEmbed] });

			kUser.send(`You were kicked in \`${guild.name}\` for \`${kReason}\``)
				.catch((err: { message: string; }) => {
					if (err.message === "Cannot send messages to this user") return channel.send("Couldn't DM the user.");
					console.log(err.message);
				});

			if (!logsChannel) {
				let noChannel = new EmbedBuilder()
					.setDescription(`Could not find mod logs channel. Please ensure a channel is set. *\`More info on /help events\`*`);
				return channel.send({ embeds: [noChannel] });
			}

			const user = kUser.user;
			let kickEmbed = new EmbedBuilder()
				.setColor("#ed2618")
				.setAuthor({ name: modmessage, iconURL: sicon })
				.addFields({
					name: 'Member Kicked', value: [
						`❯ **Member:** <@${kUser.id}> \`${user.tag}\``,
						`❯ **Moderator:** <@${moderator.id}> \`${moderator.tag}\``,
						`❯ **Reason:** \`${kReason}\``
					].join('\n')
				})
				.setTimestamp();
			(logsChannel as TextChannel).send({ embeds: [kickEmbed] }).catch((err: { message: string; }) => {
				if (err.message === "Missing Access") return;
				console.error(err);
			});
		}

	}

}