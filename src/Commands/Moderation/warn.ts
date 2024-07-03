import DaBoizClient from '../../Structures/DaBoizClient';
import Command, { CommandContext, CommandOptions } from '../../Structures/Command';
import { CommandInteraction, ApplicationCommandOptionType, GuildMember } from 'discord.js';

class WarnCommand extends Command {
	constructor(client: DaBoizClient) {
		const options: CommandOptions = {
			name: 'warn',
			description: 'Warns tagged user.',
			permissions: ['EmbedLinks'],
			userPermissions: ['ManageMessages'],
			modRolePass: true,
			category: 'moderation',
			usage: '/warn <user> <reason>',
			usable: 'Moderators only.',
			options: [
				{
					name: 'user',
					type: ApplicationCommandOptionType.User,
					description: 'The user to warn',
					required: true
				},
				{
					name: 'reason',
					type: ApplicationCommandOptionType.String,
					description: 'The reason for the warning',
					required: true
				}
			]
		};
		super(client, options);
	}

	async run(interaction: CommandInteraction, context: CommandContext): Promise<void> {
		const userOption = interaction.options.get('user')?.value as string;
		const reason = interaction.options.get('reason')?.value as string;
		const wUser = await interaction.guild?.members.fetch(userOption).catch(() => null);

		if (!wUser) {
			await interaction.reply({ content: 'Invalid User.', ephemeral: true });
			return;
		}

		if (wUser.id === process.env.OWNERID) {
			await interaction.reply({ content: 'I\'m not warning my owner lmao', ephemeral: true });
			return;
		}

		if (wUser.id === this.client.user?.id) {
			await interaction.reply({ content: 'no', ephemeral: true });
			return;
		}

		await this.client.emit('modAction', 'warn', interaction.guild, interaction.channel, reason, interaction.user, wUser, undefined, undefined);
		await interaction.reply({ content: `Warned ${wUser.user.tag} for: ${reason}`, ephemeral: false });
	}
}

export default WarnCommand;