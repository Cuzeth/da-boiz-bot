import Event from '../../Structures/Event';
import { Guild, EmbedBuilder, TextChannel, User } from 'discord.js';
import DaBoizClient from '../../Structures/DaBoizClient';

module.exports = class extends Event {

	constructor(client: DaBoizClient) {
		super(client, {
			name: 'userUpdate'
		});
	}

	async run(oldUser: User, newUser: User) {
		const db = this.client.utils.db;

		// USERNAME LOGGING
		if (oldUser.username !== newUser.username) {
			this.client.guilds.cache.forEach(async (guild: Guild) => {
				if (!guild.members.cache.get(newUser.id)) return;

				const guildId = guild.id;
				const [storedSettings]: [any[], any] = await db.query('SELECT * FROM guild_settings WHERE gid = ?', [guildId]);

				if (storedSettings.length === 0) return;
				const settings = storedSettings[0];
				if (!settings.userlogsChannelID) return;

				let userLogsChannel = guild.channels.cache.find((channel: TextChannel) => channel.id === settings.userlogsChannelID);
				if (!userLogsChannel) return;

				let nameChangeEmbed = new EmbedBuilder()
					.setColor("Blue")
					.setTitle("Username Changed")
					.addFields({ name: "User", value: `<@${newUser.id}> \`${newUser.tag}\`` })
					.addFields({ name: "Old Username", value: `\`${oldUser.username}\``, inline: true })
					.addFields({ name: "New Username", value: `\`${newUser.username}\``, inline: true })
					.setFooter({ text: `User ID: ${newUser.id}` })
					.setThumbnail(newUser.avatarURL());

				(userLogsChannel as TextChannel).send({ embeds: [nameChangeEmbed] }).catch((err: { message: string; }) => {
					if (err.message === "Missing Access") return;
					if (err.message === "Missing Permissions") return;
					console.error(err);
				});
			});
		}

		// AV LOGGING
		if (oldUser.avatar !== newUser.avatar) {
			this.client.guilds.cache.forEach(async (guild: Guild) => {
				if (!guild.members.cache.get(newUser.id)) return;

				const guildId = guild.id;
				const [storedSettings]: [any[], any] = await db.query('SELECT * FROM guild_settings WHERE gid = ?', [guildId]);

				if (storedSettings.length === 0) return;
				const settings = storedSettings[0];
				if (!settings.userlogsChannelID) return;

				let userLogsChannel = guild.channels.cache.find((channel: TextChannel) => channel.id === settings.userlogsChannelID);
				if (!userLogsChannel) return;

				let avatarChangeEmbed = new EmbedBuilder()
					.setColor("Blue")
					.setTitle("Profile Picture Changed")
					.setDescription(`**User:** <@${newUser.id}> \`${newUser.tag}\`\n**Small image:** [Old Profile Picture](${oldUser.avatarURL()})\n**Big image:** [New Profile Picture](${newUser.avatarURL()})`)
					.setFooter({ text: `User ID: ${newUser.id}` })
					.setThumbnail(oldUser.avatarURL())
					.setImage(newUser.avatarURL({ size: 128 }));

				(userLogsChannel as TextChannel).send({ embeds: [avatarChangeEmbed] }).catch((err: { message: string; }) => {
					if (err.message === "Missing Access") return;
					if (err.message === "Missing Permissions") return;
					console.error(err);
				});
			});
		}
	}
}