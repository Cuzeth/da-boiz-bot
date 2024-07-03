import { CommandInteraction, ApplicationCommandOptionType, TextChannel, GuildChannel } from 'discord.js';
import Command, { CommandContext, CommandOptions } from '../../Structures/Command';
import DaBoizClient from '../../Structures/DaBoizClient';

class LockCommand extends Command {
	constructor(client: DaBoizClient) {
		const options: CommandOptions = {
			name: 'lock',
			description: 'Locks or unlocks a channel.',
			permissions: ['Administrator'],
			userPermissions: ['Administrator'],
			category: 'moderation',
			usage: '/lock <channel> <true | false>',
			usable: 'Admins only.',
			options: [
				{
					name: 'channel',
					type: ApplicationCommandOptionType.Channel,
					description: 'The channel to lock or unlock',
					required: true
				},
				{
					name: 'lock',
					type: ApplicationCommandOptionType.Boolean,
					description: 'Set to true to lock, false to unlock',
					required: true
				}
			]
		};
		super(client, options);
	}

	async run(interaction: CommandInteraction, context: CommandContext): Promise<void> {
		const channel = interaction.options.get('channel')?.channel as GuildChannel;
		const lock = interaction.options.get('lock')?.value as boolean;
		const role = interaction.guild?.roles.everyone;

		if (!channel || !role) {
			await interaction.reply({ content: 'Invalid channel or role.', ephemeral: true });
			return;
		}

		try {
			if (lock) {
				await (channel as TextChannel).permissionOverwrites.create(role, {
					SendMessages: false,
					AddReactions: false
				});
				await interaction.reply(`Locked ${channel.name}.`);
			} else {
				await (channel as TextChannel).permissionOverwrites.create(role, {
					SendMessages: null,
					AddReactions: null
				});
				await interaction.reply(`Unlocked ${channel.name}.`);
			}
		} catch (error) {
			console.error(error);
			await interaction.reply({ content: 'Something went wrong while updating the channel permissions.', ephemeral: true });
		}
	}
}

export default LockCommand;