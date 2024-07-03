import { CommandInteraction, ApplicationCommandOptionType, EmbedBuilder, ButtonInteraction, ActionRowBuilder, ButtonBuilder, ButtonStyle } from 'discord.js';
import Command, { CommandContext, CommandOptions } from '../../Structures/Command';
import DaBoizClient from '../../Structures/DaBoizClient';

class RPSCommand extends Command {
	constructor(client: DaBoizClient) {
		const options: CommandOptions = {
			name: 'rps',
			description: 'Rock Paper Scissors game. Use buttons to play the game.',
			permissions: ['EmbedLinks', 'ManageMessages'],
			category: 'fun',
			usage: '/rps',
			usable: 'Everyone.'
		};
		super(client, options);
	}

	async run(interaction: CommandInteraction, context: CommandContext): Promise<void> {
		const embed = new EmbedBuilder()
			.setColor("#ffffff")
			.setDescription("Click a button to play the game!");

		const buttons = new ActionRowBuilder<ButtonBuilder>()
			.addComponents(
				new ButtonBuilder()
					.setCustomId('rock')
					.setLabel('Rock')
					.setStyle(ButtonStyle.Primary)
					.setEmoji('🗻'),
				new ButtonBuilder()
					.setCustomId('paper')
					.setLabel('Paper')
					.setStyle(ButtonStyle.Primary)
					.setEmoji('📰'),
				new ButtonBuilder()
					.setCustomId('scissors')
					.setLabel('Scissors')
					.setStyle(ButtonStyle.Primary)
					.setEmoji('✂')
			);

		const message = await interaction.reply({ embeds: [embed], components: [buttons], fetchReply: true });

		const filter = (i: ButtonInteraction) => i.user.id === interaction.user.id;
		const collector = message.createMessageComponentCollector({ filter, time: 30000 });

		collector.on('collect', async i => {
			const botChoice = ['rock', 'paper', 'scissors'][Math.floor(Math.random() * 3)];
			const userChoice = i.customId;

			const result = getResult(userChoice, botChoice);
			const resultEmbed = new EmbedBuilder()
				.setColor("#ffffff")
				.setDescription(`You chose ${userChoice}.\nI chose ${botChoice}.\n\n${result}`);

			await i.update({ embeds: [resultEmbed], components: [] });
		});

		collector.on('end', collected => {
			if (collected.size === 0) {
				interaction.editReply({ content: 'Time ran out! No moves were made.', components: [] });
			}
		});

		function getResult(userChoice: string, botChoice: string) {
			if ((userChoice === 'rock' && botChoice === 'scissors') ||
				(userChoice === 'paper' && botChoice === 'rock') ||
				(userChoice === 'scissors' && botChoice === 'paper')) {
				return "You won!";
			} else if (userChoice === botChoice) {
				return "It's a tie!";
			} else {
				return "You lost!";
			}
		}
	}
}

export default RPSCommand;