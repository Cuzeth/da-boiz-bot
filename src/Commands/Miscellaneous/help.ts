import { CommandInteraction, ApplicationCommandOptionType, EmbedBuilder, CommandInteractionOptionResolver, PermissionsBitField } from 'discord.js';
import Command, { CommandContext, CommandOptions } from '../../Structures/Command';
import DaBoizClient from '../../Structures/DaBoizClient';

const authorizedUsers = [
	'YOUR_DEVELOPER_USER_ID', // Replace with actual developer user IDs
	'ANOTHER_DEVELOPER_USER_ID'
];

class HelpCommand extends Command {
	constructor(client: DaBoizClient) {
		const options: CommandOptions = {
			name: 'help',
			description: 'Provides a help menu for all commands.',
			permissions: ['EmbedLinks'],
			category: 'miscellaneous',
			usage: 'help [command]',
			usable: 'Everyone.',
			options: [
				{
					name: 'command',
					type: ApplicationCommandOptionType.String,
					description: 'The command to get help for',
					required: false
				}
			]
		};
		super(client, options);
	}

	formatPermissions(perms: PermissionsBitField | undefined): string {
		if (!perms) return 'No Permissions.';
		const permArray = new PermissionsBitField(perms).toArray();
		return permArray.map(perm => this.client.utils.formatPerms(perm)).join(', ');
	}

	async run(interaction: CommandInteraction, context: CommandContext): Promise<void> {
		const commandName = (interaction.options as CommandInteractionOptionResolver).getString('command');

		if (commandName) {
			let command: string | Command = commandName.toLowerCase();
			command = this.client.commands.get(command);

			if (!command) {
				await interaction.reply({ content: 'Invalid command.', ephemeral: true });
				return;
			}

			if (command.devOnly && !authorizedUsers.includes(interaction.user.id)) {
				await interaction.reply({ content: 'You do not have permission to view this command.', ephemeral: true });
				return;
			}

			const helpMenu = new EmbedBuilder()
				.setColor(context.maincolor)
				.setAuthor({ name: "Command help", iconURL: this.client.user?.avatarURL() || '' })
				.addFields({
					name: 'Parameters: `< >` is strict & `[ ]` is optional', value: [
						`❯ **Command:** ${command.name}`,
						`❯ **Description:** ${command.description || "No description."}`,
						`❯ **Cooldown:** ${command.cooldown || 3} seconds.`,
						`❯ **Category:** ${this.client.utils.capitalize(command.category) || "\`Error.\`"}`,
						`❯ **Usage:** /${command.usage || "No usage info."}`,
						`❯ **Usable by:** ${command.usable || "No info."}`,
						`❯ **Mod command:** ${this.client.utils.capitalize(`${command.modRolePass}`)}.`
					].join('\n')
				})
				.addFields({ name: "Required Permissions", value: `\`${this.formatPermissions(command.permissions)}\`` })
				.addFields({ name: "Required User Permissions", value: `\`${this.formatPermissions(command.userPermissions)}\`` })
				.setFooter({ text: this.client.footerName as string, iconURL: context.sicon });

			await interaction.reply({ embeds: [helpMenu] });

		} else {
			const helpMenu = new EmbedBuilder()
				.setDescription(`\`/help [command]\` will show more info about that command.\nFor info on how to set up event logging, do \`/help events\`.\nYou can set the bot's embed color by changing the color of its role.`)
				.setTitle('Help Menu')
				.setFooter({ text: this.client.user?.username || '', iconURL: this.client.user?.avatarURL() || '' })
				.setColor(context.maincolor);

			const categories = this.client.utils.removeDuplicates(this.client.commands.map((cmd: Command) => cmd.category));

			for (const category of categories) {
				if (category === undefined) continue;
				if (category === "developer" && !authorizedUsers.includes(interaction.user.id)) continue;

				helpMenu.addFields({
					name: `**${this.client.utils.capitalize(category)}**`, value: this.client.commands.filter((cmd: Command) =>
						cmd.category === category).map((cmd: Command) => `\`/${cmd.name}\``).join(', ')
				});
			}

			await interaction.reply({ embeds: [helpMenu] });
		}
	}
}

export default HelpCommand;