import DaBoizClient from '../../Structures/DaBoizClient';
import Command, { CommandContext, CommandOptions } from '../../Structures/Command';
import { EmbedBuilder, ApplicationCommandOptionType, GuildMember, CommandInteraction } from 'discord.js';

class StrikesCommand extends Command {
	constructor(client: DaBoizClient) {
		const options: CommandOptions = {
			name: 'strikes',
			description: 'Shows user\'s strikes.',
			permissions: ['EmbedLinks'],
			category: 'moderation',
			usage: '/strikes [user]',
			usable: 'Everyone.',
			options: [
				{
					name: 'user',
					type: ApplicationCommandOptionType.User,
					description: 'The user to check strikes for',
					required: false
				}
			]
		};
		super(client, options);
	}

	async run(interaction: CommandInteraction, context: CommandContext): Promise<void> {
		const targetUser = interaction.options.get('user')?.value as string;
		let caseUser: GuildMember | null = null;

		if (targetUser) {
			caseUser = await interaction.guild?.members.fetch(targetUser).catch(() => null);
		} else {
			caseUser = interaction.member as GuildMember;
		}

		if (!caseUser) {
			await interaction.reply({ content: 'Invalid User.', ephemeral: true });
			return;
		}

		if (caseUser.id === process.env.OWNERID || caseUser.id === this.client.user?.id) {
			await interaction.reply({ content: 'zero mf', ephemeral: true });
			return;
		}

		const db = this.client.utils.db;
		const guildId = interaction.guild?.id;

		const [strikeRows]: [any[], any] = await db.execute('SELECT * FROM strikes WHERE guildID = ? AND userID = ?', [guildId, caseUser.id]);

		const embed = new EmbedBuilder()
			.setColor('Blurple')
			.setTitle(strikeRows.length > 0 ? `${caseUser.user.username}'s recent strikes [Strikes: ${strikeRows[0].strikeCount || '0'}]:` : `${caseUser.user.username} has no strikes.`);

		const [caseRows]: [any[], any] = await db.execute('SELECT * FROM cases WHERE guildID = ? AND userID = ? ORDER BY id ASC LIMIT 10', [guildId, caseUser.id]);

		if (caseRows.length === 0) {
			embed.setColor('Red');
			embed.addFields({ name: 'Error', value: 'This user doesn\'t have any cases in this server.' });
		} else {
			for (const caseEntry of caseRows) {
				const mod = interaction.guild?.members.cache.get(caseEntry.modID);
				embed.addFields({
					name: `${caseEntry.type}`,
					value: `❯ **Moderator**: <@${mod?.id}> \`${mod?.user.tag}\`\n❯ **Reason:** ${caseEntry.reason}\n❯ **ID:** ${caseEntry.id}`
				});
			}
		}

		await interaction.reply({ embeds: [embed] });
	}
}

export default StrikesCommand;