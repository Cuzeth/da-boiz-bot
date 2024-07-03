import { CommandInteraction, ApplicationCommandOptionType, GuildMember, EmbedBuilder, CommandInteractionOptionResolver } from 'discord.js';
import Command, { CommandContext } from '../../Structures/Command';
import DaBoizClient from '../../Structures/DaBoizClient';

class AvatarCommand extends Command {
	constructor(client: DaBoizClient) {
		super(client, {
			name: 'avatar',
			description: 'Displays tagged user\'s avatar.',
			permissions: ['EmbedLinks', 'AttachFiles'],
			category: 'miscellaneous',
			usage: 'avatar [user]',
			usable: 'Everyone.',
			options: [
				{
					name: 'user',
					type: ApplicationCommandOptionType.User,
					description: 'The user to get the avatar of',
					required: false
				}
			]
		});
	}

	async run(interaction: CommandInteraction, context: CommandContext): Promise<void> {
		const targetUser = (interaction.options as CommandInteractionOptionResolver).getUser('user') || interaction.user;
		const guildMember: GuildMember | null = await interaction.guild?.members.fetch(targetUser.id).catch(() => null);

		const user = guildMember?.user || targetUser;

		const avatarEmbed = new EmbedBuilder()
			.setTitle(`${user.username}'s avatar`)
			.setImage(user.avatarURL({ size: 1024 }) || '')
			.setColor(context.maincolor);

		await interaction.reply({ embeds: [avatarEmbed] });
	}
}

export default AvatarCommand;