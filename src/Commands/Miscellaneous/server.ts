import { CommandInteraction, ChannelType, EmbedBuilder, GuildVerificationLevel, GuildExplicitContentFilter } from 'discord.js';
import Command, { CommandContext, CommandOptions } from '../../Structures/Command';
import DaBoizClient from '../../Structures/DaBoizClient';
import moment from 'moment';

const filterLevels: Record<GuildExplicitContentFilter, string> = {
	0: 'Off',
	1: 'No Role',
	2: 'Everyone'
};

const verificationLevels: Record<GuildVerificationLevel, string> = {
	0: 'None',
	1: 'Low',
	2: 'Medium',
	3: 'High',
	4: 'Very High'
};

class ServerCommand extends Command {
	constructor(client: DaBoizClient) {
		const options: CommandOptions = {
			name: 'server',
			description: 'Displays server info.',
			permissions: ['EmbedLinks'],
			category: 'miscellaneous',
			usage: 'server',
			usable: 'Everyone.'
		};
		super(client, options);
	}

	async run(interaction: CommandInteraction, context: CommandContext): Promise<void> {
		const guild = interaction.guild;

		if (!guild) {
			await interaction.reply({ content: 'This command can only be used in a server.', ephemeral: true });
			return;
		}

		const roles = guild.roles.cache.sort((a, b) => b.position - a.position).map(role => role.toString());
		const members = guild.members.cache;
		const channels = guild.channels.cache;
		const emojis = guild.emojis.cache;

		const serverembed = new EmbedBuilder()
			.setAuthor({ name: guild.name, iconURL: guild.iconURL() || '' })
			.addFields({
				name: 'General', value: [
					`**❯ Name:** ${guild.name}`,
					`**❯ ID:** ${guild.id}`,
					`**❯ Owner:** ${(await guild.fetchOwner()).user.tag}`,
					`**❯ Boost Tier:** ${guild.premiumTier ? `Tier ${guild.premiumTier}` : 'None'}`,
					`**❯ Explicit Filter:** ${filterLevels[guild.explicitContentFilter]}`,
					`**❯ Verification Level:** ${verificationLevels[guild.verificationLevel]}`,
					`**❯ Time Created:** ${moment(guild.createdTimestamp).format('LT')} ${moment(guild.createdTimestamp).format('LL')} (${moment(guild.createdTimestamp).fromNow()})`
				].join('\n'), inline: true
			})
			.addFields({
				name: 'Stats', value: [
					`**❯ Role Count:** ${roles.length}`,
					`**❯ Emoji Count:** ${emojis.size}`,
					`**❯ Regular Emoji Count:** ${emojis.filter(emoji => !emoji.animated).size}`,
					`**❯ Animated Emoji Count:** ${emojis.filter(emoji => emoji.animated).size}`,
					`**❯ Member Count:** ${guild.memberCount}`,
					`**❯ Humans:** ${members.filter(member => !member.user.bot).size}`,
					`**❯ Bots:** ${members.filter(member => member.user.bot).size}`,
					`**❯ Text Channels:** ${channels.filter(channel => channel.type === ChannelType.GuildText).size}`,
					`**❯ Voice Channels:** ${channels.filter(channel => channel.type === ChannelType.GuildVoice).size}`,
					`**❯ Boost Count:** ${guild.premiumSubscriptionCount || '0'}`
				].join('\n'), inline: true
			})
			.setColor(context.maincolor)
			.setThumbnail(guild.iconURL() || '')
			.setFooter({ text: this.client.footerName as string, iconURL: guild.iconURL() || '' });

		await interaction.reply({ embeds: [serverembed] });
	}
}

export default ServerCommand;