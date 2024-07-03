import { CommandInteraction, ApplicationCommandOptionType } from 'discord.js';
import Command, { CommandContext, CommandOptions } from '../../Structures/Command';
import DaBoizClient from '../../Structures/DaBoizClient';

class DelStrikesCommand extends Command {
	constructor(client: DaBoizClient) {
		const options: CommandOptions = {
			name: 'delstrikes',
			description: 'Deletes a user\'s strikes.',
			permissions: ['EmbedLinks'],
			userPermissions: ['Administrator'],
			category: 'moderation',
			usage: '/delstrikes <user>',
			usable: 'Admins only.',
			options: [
				{
					name: 'user',
					type: ApplicationCommandOptionType.User,
					description: 'The user whose strikes to delete',
					required: true
				}
			]
		};
		super(client, options);
	}

	async run(interaction: CommandInteraction, context: CommandContext): Promise<void> {
		const user = interaction.options.get('user')?.user;

		if (!user) {
			await interaction.reply({ content: 'Invalid User.', ephemeral: true });
			return;
		}

		try {
			const caseUser = await interaction.guild?.members.fetch(user.id);
			if (!caseUser) {
				await interaction.reply({ content: 'Invalid User.', ephemeral: true });
				return;
			}

			const db = this.client.utils.db;
			const guildId = interaction.guild?.id;

			await db.execute('DELETE FROM strikes WHERE guildID = ? AND userID = ?', [guildId, caseUser.id]);
			await db.execute('DELETE FROM cases WHERE guildID = ? AND userID = ?', [guildId, caseUser.id]);

			await interaction.reply(`Deleted ${caseUser.user.username}'s strikes.`);
		} catch (err: any) {
			console.log(err);
			await interaction.reply({ content: 'An error occurred while deleting the strikes.', ephemeral: true });
		}
	}
}

export default DelStrikesCommand;