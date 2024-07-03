import DaBoizClient from '../../Structures/DaBoizClient';
import Command, { CommandContext, CommandOptions } from '../../Structures/Command';
import { EmbedBuilder, ApplicationCommandOptionType, CommandInteraction } from 'discord.js';

class SetModNameCommand extends Command {
	constructor(client: DaBoizClient) {
		const options: CommandOptions = {
			name: 'setmodname',
			description: 'Change the bot\'s "mod name" for this guild. **Default message: Da Boiz Moderation.**',
			category: 'configuration',
			permissions: ['EmbedLinks'],
			userPermissions: ['ManageGuild'],
			usage: '/setmodname <new message>',
			usable: 'Moderators only.',
			options: [
				{
					name: 'newname',
					type: ApplicationCommandOptionType.String,
					description: 'The new mod name for this guild',
					required: true
				}
			]
		};
		super(client, options);
	}

	async run(interaction: CommandInteraction, context: CommandContext): Promise<void> {
		const newName = interaction.options.get('newname')?.value as string;

		if (!newName) {
			await interaction.reply({ content: 'Please provide a new mod name.', ephemeral: true });
			return;
		}

		if (newName.length > 20 && interaction.user.id !== process.env.OWNERID) {
			await interaction.reply({ content: 'Please limit your name to 20 or fewer characters.', ephemeral: true });
			return;
		}

		const db = this.client.utils.db;
		const guildId = interaction.guild?.id;

		const query = `
			INSERT INTO guild_settings (gid, modmessage)
			VALUES (?, ?)
			ON DUPLICATE KEY UPDATE modmessage = VALUES(modmessage);
		`;

		await db.execute(query, [guildId, newName]);

		await interaction.reply(`Set guild mod name to \`${newName}\``);

		const embed = new EmbedBuilder()
			.setColor('Red')
			.setDescription(`Warned \`TrollPerson#0001\` | **${newName}**`);

		await interaction.followUp({ content: 'Example embed:', embeds: [embed] });
	}
}

export default SetModNameCommand;