import { CommandInteraction, ApplicationCommandOptionType, TextChannel, EmbedBuilder } from 'discord.js';
import Command, { CommandContext, CommandOptions } from '../../Structures/Command';
import DaBoizClient from '../../Structures/DaBoizClient';

class PurgeCommand extends Command {
	constructor(client: DaBoizClient) {
		const options: CommandOptions = {
			name: 'purge',
			description: 'Deletes a specific amount of messages.',
			permissions: ['ManageMessages', 'ReadMessageHistory'],
			userPermissions: ['ManageMessages', 'ReadMessageHistory'],
			modRolePass: true,
			category: 'moderation',
			usage: '/purge <number of messages>',
			usable: 'Moderators only.',
			options: [
				{
					name: 'amount',
					type: ApplicationCommandOptionType.Integer,
					description: 'The number of messages to delete',
					required: true
				}
			]
		};
		super(client, options);
	}

	async run(interaction: CommandInteraction, context: CommandContext): Promise<void> {
		const amountOption = interaction.options.get('amount');
		const amount = amountOption ? (amountOption.value as number) : 0;

		if (amount < 1) {
			await interaction.reply({ content: 'You need to input a number greater than 0.', ephemeral: true });
			return;
		}

		await this.deleteMessages(interaction, amount);

		const GuildSettings = require('../../models/settings');
		var storedSettings = await GuildSettings.findOne({ gid: interaction.guild?.id });
		let msgLogsChannel = interaction.guild?.channels.cache.find((channel: TextChannel) => channel.id === storedSettings.chatlogsChannelID);
		if (!msgLogsChannel) return;
		if (!interaction.guild?.members.me?.permissionsIn(msgLogsChannel).has(['EmbedLinks', 'SendMessages'])) return;

		let user = interaction.member;
		let deleteEmbed = new EmbedBuilder()
			.setTitle('Messages Purged')
			.addFields({ name: 'Moderator', value: `<@!${user.user.id}>`, inline: true })
			.addFields({ name: 'Channel', value: `<#${interaction.channelId}>`, inline: true })
			.addFields({ name: 'Amount', value: `\`${amount} messages\`` })
			.setTimestamp(new Date());

		(msgLogsChannel as TextChannel).send({ embeds: [deleteEmbed] }).catch((err: { message: string }) => {
			if (err.message === 'Invalid Form Body') return;
			if (err.message === 'Missing Access') return;
			console.error(err);
		});

		interaction.reply({ content: `Purged ${amount} messages.`, ephemeral: true })
	}

	async deleteMessages(interaction: CommandInteraction, amount: number) {
		await this.client.utils.delay(2000);

		if (amount < 100) {
			await (interaction.channel as TextChannel).bulkDelete(amount, true).catch((err: any) => {
				console.error(err);
				interaction.followUp({ content: 'There was an error trying to prune messages in this channel!', ephemeral: true });
			});
		} else {
			interaction.channel?.messages.fetch({ limit: 100 })
				.then((messages: any) => {
					(interaction.channel as TextChannel).bulkDelete(messages, true);
					amount = amount - 100;
					messages.forEach((message: any, index: number) => {
						if (index == 99) {
							this.deleteMessages(interaction, amount);
						}
					});
				})
				.catch(console.error);
		}
	}
}

export default PurgeCommand;