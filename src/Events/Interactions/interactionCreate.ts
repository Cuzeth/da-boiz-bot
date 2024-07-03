import { Interaction, EmbedBuilder, Collection, TextChannel, Role, ColorResolvable, GuildMember } from 'discord.js';
import Event from '../../Structures/Event';
import DaBoizClient from '../../Structures/DaBoizClient';
import { CommandContext } from '../../Structures/Command';
import mysql from 'mysql2/promise';

const cooldowns = new Collection<string, Collection<string, number>>();

module.exports = class extends Event {

	constructor(client: DaBoizClient) {
		super(client, {
			name: 'interactionCreate'
		});
	}

	async run(interaction: Interaction) {
		if (!interaction.isCommand()) return;

		const commandName = interaction.commandName;
		const command = this.client.commands.get(commandName);
		if (!command) return;

		// Developer-only command check
		if (command.devOnly && (interaction.user.id != process.env.OWNERID)) {
			await interaction.reply({ content: 'You do not have permission to use this command.', ephemeral: true });
			return;
		}

		// Retrieving the guild settings from the database.
		const db = this.client.utils.db;
		const guildId = interaction.guild.id;
		let [storedSettings]: [any[], mysql.FieldPacket[]] = await db.query('SELECT * FROM guild_settings WHERE gid = ?', [guildId]);

		if (storedSettings.length === 0) {
			await db.query('INSERT INTO guild_settings (gid) VALUES (?)', [guildId]);
			storedSettings = await db.query('SELECT * FROM guild_settings WHERE gid = ?', [guildId]);
		}

		const settings = storedSettings[0];

		// Don't proceed if the bot can't send messages in the channel
		if (!interaction.guild.members.me.permissionsIn(interaction.channelId).has(["SendMessages"])) {
			return;
		}

		const sicon = interaction.guild.iconURL();
		const maincolor: ColorResolvable = interaction.guild.members.me.displayHexColor;

		const member = interaction.member as GuildMember;

		if (!(command.modRolePass && (member.roles.cache.some((role: Role) => role.id === settings.modroleID)))) {
			const userPermCheck = command.userPermissions ? this.client.defaultPerms.add(command.userPermissions) : this.client.defaultPerms;
			if (userPermCheck) {
				const missing = member.permissions.missing(userPermCheck);
				if (missing.length) {
					await interaction.reply({ content: `You need the \`${this.client.utils.formatArray(missing.map(this.client.utils.formatPerms))}\` permission(s) to use this command.`, ephemeral: true });
					return;
				}
			}
		}

		const botPermCheck = command.permissions ? this.client.defaultPerms.add(command.permissions) : this.client.defaultPerms;
		if (botPermCheck) {
			const missing = interaction.guild.members.me.permissions.missing(botPermCheck);
			if (missing.length) {
				await interaction.reply({ content: `I need the \`${this.client.utils.formatArray(missing.map(this.client.utils.formatPerms))}\` permission(s) to run this command.`, ephemeral: true });
				return;
			}
		}

		// Set cooldown
		if (!cooldowns.has(command.name)) {
			cooldowns.set(command.name, new Collection());
		}

		const now = Date.now();
		const timestamps = cooldowns.get(command.name);
		const cooldownAmount = (command.cooldown || 3) * 1000;

		if (timestamps.has(interaction.user.id)) {
			const expirationTime = timestamps.get(interaction.user.id) + cooldownAmount;

			if (now < expirationTime) {
				const timeLeft = (expirationTime - now) / 1000;
				await interaction.reply({ content: `Please wait ${timeLeft.toFixed(1)} second(s) before reusing the \`${command.name}\` command.`, ephemeral: true });
				return;
			}
		}

		timestamps.set(interaction.user.id, now);
		setTimeout(() => timestamps.delete(interaction.user.id), cooldownAmount);

		const args = interaction.options.data.map(option => option.value);

		const context: CommandContext = {
			args,
			sicon,
			maincolor
		};

		// Run the command
		try {
			await command.run(interaction, context);
		} catch (error) {
			const errorEmbed = new EmbedBuilder()
				.setTitle(`\`${error.name}\``)
				.setDescription(`\`${error.message}\``)
				.addFields({ name: "Command", value: interaction.commandName, inline: true })
				.setColor(`#FF0000`)
				.setTimestamp();

			const channel = this.client.channels.cache.get('689835576949866605') as TextChannel;
			try {
				const webhooks = await channel.fetchWebhooks();
				const webhook = webhooks.first();

				await webhook.send({
					username: `${this.client.user.username} Error`,
					avatarURL: `${this.client.user.avatarURL()}`,
					embeds: [errorEmbed],
				});
			} catch (error) {
				console.error('Error trying to send: ', error.message);
			}

			console.error(error);
			await interaction.reply({ content: `Something went wrong.`, ephemeral: true });
		}
	}
};