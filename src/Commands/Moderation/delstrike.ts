import { CommandInteraction, ApplicationCommandOptionType, EmbedBuilder } from 'discord.js';
import Command, { CommandContext, CommandOptions } from '../../Structures/Command';
import DaBoizClient from '../../Structures/DaBoizClient';
import mysql from 'mysql2/promise';

class DelStrikeCommand extends Command {
	constructor(client: DaBoizClient) {
		const options: CommandOptions = {
			name: 'delstrike',
			description: 'Deletes a strike.',
			permissions: ['EmbedLinks'],
			userPermissions: ['Administrator'],
			category: 'moderation',
			usage: '/delstrike <case_id>',
			usable: 'Admins only.',
			options: [
				{
					name: 'case_id',
					type: ApplicationCommandOptionType.String,
					description: 'The ID of the case to delete',
					required: true
				}
			]
		};
		super(client, options);
	}

	async run(interaction: CommandInteraction, context: CommandContext): Promise<void> {
		const caseId = interaction.options.get('case_id')?.value as string;
		const guildId = interaction.guild?.id;
		const db = this.client.utils.db;

		try {
			const [caseRows]: [any[], mysql.FieldPacket[]] = await db.execute('SELECT * FROM cases WHERE guildID = ? AND id = ?', [guildId, caseId]);

			if (caseRows.length === 0) {
				await interaction.reply({ content: 'Could not find that case.', ephemeral: true });
				return;
			}

			const caseOBJ = caseRows[0];
			let amount = 0;

			if (caseOBJ.type === "Warn") amount = 1;
			if (caseOBJ.type === "Mute") amount = 2;

			const [strikeRows]: [any[], mysql.FieldPacket[]] = await db.execute('SELECT * FROM strikes WHERE guildID = ? AND userID = ?', [guildId, caseOBJ.userID]);

			if (strikeRows.length === 0) {
				await interaction.reply({ content: 'Could not find strikes for that user.', ephemeral: true });
				return;
			}

			const strikeCount = strikeRows[0].strikeCount - amount;

			await db.execute('UPDATE strikes SET strikeCount = ? WHERE guildID = ? AND userID = ?', [strikeCount, guildId, caseOBJ.userID]);
			await db.execute('DELETE FROM cases WHERE guildID = ? AND id = ?', [guildId, caseId]);

			const amr = new EmbedBuilder().setDescription(`Deleted case ${caseId}. Their strike count is now ${strikeCount}.`).setColor("Blurple");

			await interaction.reply({ embeds: [amr] });
		} catch (err: any) {
			console.log(err);
			if (err.message.includes("Cast to ObjectId failed for value")) {
				await interaction.reply({ content: 'Could not find that case.', ephemeral: true });
			} else {
				await interaction.reply({ content: 'An error occurred while deleting the case.', ephemeral: true });
			}
		}
	}
}

export default DelStrikeCommand;