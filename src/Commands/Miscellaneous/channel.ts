import DaBoizClient from '../../Structures/DaBoizClient';
import Command, { CommandContext, CommandOptions } from '../../Structures/Command';
import { ApplicationCommandOptionType, CommandInteraction, TextChannel, EmbedBuilder, ChannelType } from 'discord.js';
import { utc } from 'moment';

class ChannelCommand extends Command {
	constructor(client: DaBoizClient) {
		const options: CommandOptions = {
			name: 'channel',
			description: 'Displays channel info.',
			permissions: ['EmbedLinks'],
			category: 'miscellaneous',
			usage: '/channel [#channel]',
			usable: 'Everyone.',
			options: [
				{
					name: 'channel',
					type: ApplicationCommandOptionType.Channel,
					description: 'The channel to get information about',
					required: false
				}
			]
		};
		super(client, options);
	}

	async run(interaction: CommandInteraction, context: CommandContext): Promise<void> {
		let channel = interaction.options.get('channel')?.channel as TextChannel;

		if (!channel) {
			channel = interaction.channel as TextChannel;
		}

		if (channel.type !== ChannelType.GuildText) {
			await interaction.reply({ content: 'Please select a text channel.', ephemeral: true });
			return;
		}

		const channelInfo = new EmbedBuilder()
			.setColor('Blue')
			.setAuthor({ name: `${channel.name} - Info`, iconURL: context.sicon })
			.setDescription(`**❯ Channel Name:** ${channel}\n**❯ Channel ID:** ${channel.id}\n**❯ NSFW:** ${channel.nsfw ? 'Yes' : 'No'}\n**❯ Channel Type:** ${this.client.utils.formatPerms(channel.type.toString())}\n**❯ Topic:** ${channel.topic || 'None'}\n**❯ Channel Position:** ${channel.position + 1}\n**❯ Creation Date:** ${utc(channel.createdAt).format('dddd, MMMM D, YYYY, h:mm:ss A')}`)
			.setFooter({ text: (this.client.footerName as string), iconURL: context.sicon });

		await interaction.reply({ embeds: [channelInfo] }).catch(console.error);
	}
}

export default ChannelCommand;