import { CommandInteraction, ApplicationCommandOptionType, EmbedBuilder, PermissionsBitField, Role } from 'discord.js';
import Command, { CommandContext, CommandOptions } from '../../Structures/Command';
import { utc } from 'moment';
import DaBoizClient from '../../Structures/DaBoizClient';

class RoleCommand extends Command {
	constructor(client: DaBoizClient) {
		const options: CommandOptions = {
			name: 'role',
			description: 'Displays role info.',
			permissions: ['EmbedLinks'],
			category: 'miscellaneous',
			usage: '/role <@role>',
			usable: 'Everyone.',
			options: [
				{
					name: 'role',
					type: ApplicationCommandOptionType.Role,
					description: 'The role to get information about',
					required: true
				}
			]
		};
		super(client, options);
	}

	async run(interaction: CommandInteraction, context: CommandContext): Promise<void> {
		const role = interaction.options.get('role')?.role as Role;

		if (!role) {
			await interaction.reply({ content: 'Could not find role.', ephemeral: true });
			return;
		}

		let allPermissions: any = Object.entries(new PermissionsBitField(role.permissions).serialize());
		for (const perm in allPermissions) {
			if ((allPermissions[perm]).toString().indexOf(',false') > -1) {
				delete allPermissions[perm];
			}
		}
		allPermissions = allPermissions.filter((item: string) => item !== 'true');
		for (const perm in allPermissions) {
			allPermissions[perm] = allPermissions[perm].toString().replace(',true', '');
		}

		const roleInfo = new EmbedBuilder()
			.setColor(role.hexColor)
			.setAuthor({ name: `${role.name} - Info`, iconURL: interaction.guild?.iconURL() || '' })
			.setDescription(`**❯ Role Name:** ${role}\n**❯ Role ID:** ${role.id}\n**❯ Color:** ${role.hexColor || 'None'}\n**❯ Hoisted:** ${role.hoist ? 'Yes' : 'No'}\n**❯ Mentionable:** ${role.mentionable ? 'Yes' : 'No'}\n**❯ Members With Role:** ${interaction.guild?.roles.cache.get(role.id)?.members.size}\n**❯ Creation Date:** ${utc(role.createdAt).format("dddd, MMMM D, YYYY, h:mm:ss A")} UTC\n**❯ Role Permissions:** \`${allPermissions.length ? this.client.utils.formatArray(allPermissions.map(this.client.utils.formatPerms)) : 'No permissions.'}\``)
			.setFooter({ text: this.client.footerName as string, iconURL: interaction.guild?.iconURL() || '' });

		await interaction.reply({ embeds: [roleInfo] }).catch(console.error);
	}
}

export default RoleCommand;