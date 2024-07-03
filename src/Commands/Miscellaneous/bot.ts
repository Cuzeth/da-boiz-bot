import { CommandInteraction, EmbedBuilder } from 'discord.js';
import Command, { CommandContext, CommandOptions } from '../../Structures/Command';
import DaBoizClient from '../../Structures/DaBoizClient';
import ms from 'ms';

const { version: djsversion } = require('discord.js');

class BotCommand extends Command {
	constructor(client: DaBoizClient) {
		const options: CommandOptions = {
			name: 'bot',
			description: 'Displays bot version, and owner.',
			permissions: ['EmbedLinks'],
			category: 'miscellaneous',
			usage: 'bot',
			usable: 'Everyone.'
		};
		super(client, options);
	}

	async run(interaction: CommandInteraction, context: CommandContext): Promise<void> {
		const botInfo = new EmbedBuilder()
			.setColor(context.maincolor)
			.setAuthor({ name: "Bot Info", iconURL: this.client.user?.avatarURL() || '' })
			.addFields({
				name: 'General Info', value: [
					`❯ **Name:** ${this.client.user?.tag}`,
					`**❯ ID:** ${this.client.user?.id}`,
					`**❯ Commands:** ${this.client.commands.size}`,
					`**❯ Servers:** ${this.client.guilds.cache.size.toLocaleString()}`,
					`**❯ Users:** ${this.client.guilds.cache.reduce((a: number, b) => a + b.memberCount, 0).toLocaleString()}`,
					`**▽ Versions:**`,
					`\u3000**❯ Node.js:** ${process.version}`,
					`\u3000**❯ Bot:** v${this.client.version}`,
					`\u3000**❯ Discord.js:** v${djsversion}`,
					`**❯ Uptime:** ${ms(this.client.uptime || 0, { long: true })}`,
					`**❯ Invite Link:** [Link](https://discordapp.com/api/oauth2/authorize?client_id=${this.client.user?.id}&permissions=8&scope=bot%20applications.commands)`
				].join('\n')
			})
			.setFooter({ text: this.client.footerName as string, iconURL: context.sicon });

		await interaction.reply({ embeds: [botInfo] });
	}
}

export default BotCommand;