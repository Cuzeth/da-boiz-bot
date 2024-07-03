import { CommandInteraction, ApplicationCommandOptionType, EmbedBuilder, Role } from 'discord.js';
import Command, { CommandContext, CommandOptions } from '../../Structures/Command';
import DaBoizClient from '../../Structures/DaBoizClient';

class SetModRoleCommand extends Command {
	constructor(client: DaBoizClient) {
		const options: CommandOptions = {
			name: 'setmodrole',
			description: 'Change the guild\'s moderator role. This will bypass any mod commands.',
			category: 'configuration',
			permissions: ['EmbedLinks'],
			userPermissions: ['ManageGuild'],
			usage: '/setmodrole <@role | role id | off>',
			usable: 'Moderators only.',
			options: [
				{
					name: 'role',
					type: ApplicationCommandOptionType.Role,
					description: 'The role to set as moderator role',
					required: false
				},
				{
					name: 'off',
					type: ApplicationCommandOptionType.String,
					description: 'Set the mod role off',
					required: false,
					choices: [
						{ name: 'off', value: 'off' }
					]
				}
			]
		};
		super(client, options);
	}

	async run(interaction: CommandInteraction, context: CommandContext): Promise<void> {
		const role = interaction.options.get('role')?.role as Role;
		const off = interaction.options.get('off')?.value === 'off';
		const guildId = interaction.guild?.id;

		if (!role && !off) {
			await interaction.reply({ content: 'Please provide a role or choose "off".', ephemeral: true });
			return;
		}

		const db = this.client.utils.db;
		let modRoleId = 'notset';

		if (!off) {
			modRoleId = role.id;
		}

		const query = `
			INSERT INTO guild_settings (gid, modroleID)
			VALUES (?, ?)
			ON DUPLICATE KEY UPDATE modroleID = VALUES(modroleID);
		`;

		await db.execute(query, [guildId, modRoleId]);

		const embed = new EmbedBuilder()
			.setColor('Blue')
			.setTitle('Done!')
			.setDescription(`Set ${off ? 'no mod role' : `<@&${modRoleId}>`} as the mod role.`);
		await interaction.reply({ embeds: [embed], ephemeral: true });
	}
}

export default SetModRoleCommand;