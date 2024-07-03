import { ChannelType, EmbedBuilder, TextChannel, CommandInteraction, ApplicationCommandOptionType } from 'discord.js';
import DaBoizClient from '../../Structures/DaBoizClient';
import Command, { CommandContext, CommandOptions } from '../../Structures/Command';

class SetLogChannelCommand extends Command {
	constructor(client: DaBoizClient) {
		const options: CommandOptions = {
			name: 'setlogchannel',
			description: 'Change the bot\'s logging channels for this guild.',
			category: 'configuration',
			userPermissions: ['ManageGuild'],
			usage: '/setlogchannel <MOD | MEMBER | USER | CHAT | NICKNAME | ROLE > <#channel | OFF>',
			usable: 'Moderators only.',
			options: [
				{
					name: 'type',
					type: ApplicationCommandOptionType.String,
					description: 'The type of log channel to set',
					required: true,
					choices: [
						{ name: 'MOD', value: 'mod' },
						{ name: 'MEMBER', value: 'member' },
						{ name: 'USER', value: 'user' },
						{ name: 'CHAT', value: 'chat' },
						{ name: 'NICKNAME', value: 'nickname' },
						{ name: 'ROLE', value: 'role' },
					]
				},
				{
					name: 'channel',
					type: ApplicationCommandOptionType.Channel,
					description: 'The channel to set as the log channel (or OFF to disable)',
					required: true
				}
			]
		};
		super(client, options);
	}

	async run(interaction: CommandInteraction, context: CommandContext): Promise<void> {
		const type = interaction.options.get('type')?.value as string;
		const channelOption = interaction.options.get('channel')?.channel as TextChannel;

		const db = this.client.utils.db;
		const guildId = interaction.guild?.id;

		let off = false;

		if (channelOption.id.toLowerCase() === 'off') {
			off = true;
		} else {
			if (channelOption.type !== ChannelType.GuildText) {
				await interaction.reply({ content: 'Please provide a text channel.', ephemeral: true });
				return;
			}
		}

		let logChannelField: string = '';

		switch (type.toLowerCase()) {
			case 'mod':
				logChannelField = 'modlogChannelID';
				break;
			case 'member':
				logChannelField = 'memberlogsChannelID';
				break;
			case 'user':
				logChannelField = 'userlogsChannelID';
				break;
			case 'chat':
				logChannelField = 'chatlogsChannelID';
				break;
			case 'nickname':
				logChannelField = 'nicklogsChannelID';
				break;
			case 'role':
				logChannelField = 'rolelogsChannelID';
				break;
			default:
				await interaction.reply({ content: `Invalid log channel type: ${type}`, ephemeral: true });
				return;
		}

		const query = `
			INSERT INTO guild_settings (gid, ${logChannelField})
			VALUES (?, ?)
			ON DUPLICATE KEY UPDATE ${logChannelField} = VALUES(${logChannelField});
		`;

		await db.execute(query, [guildId, off ? 'notset' : channelOption.id]);

		let embed = new EmbedBuilder()
			.setColor('Blue')
			.setTitle('Done!')
			.setDescription(`Set guild ${type} log channel to ${off ? 'OFF' : `<#${channelOption.id}>`}.`);
		await interaction.reply({ embeds: [embed] });
	}
}

export default SetLogChannelCommand;