import DaBoizClient from '../../Structures/DaBoizClient';
import Command, { CommandContext, CommandOptions } from '../../Structures/Command';
import { CommandInteraction, ApplicationCommandOptionType, CommandInteractionOptionResolver } from 'discord.js';

class EightBallCommand extends Command {
	constructor(client: DaBoizClient) {
		const options: CommandOptions = {
			name: '8ball',
			description: 'Use the 8ball.',
			category: 'fun',
			usage: '/8ball <question>',
			usable: 'Everyone.',
			options: [
				{
					name: 'question',
					type: ApplicationCommandOptionType.String,
					description: 'The question to ask the 8ball',
					required: true,
				},
			],
		};
		super(client, options);
	}

	async run(interaction: CommandInteraction, context: CommandContext): Promise<void> {
		const question = (interaction.options as CommandInteractionOptionResolver).getString('question');
		if (!question) {
			await interaction.reply({ content: 'You need to ask a question.', ephemeral: true });
			return;
		}

		await interaction.reply(`🎱 says: ${ball()}`);
	}
}

function ball(): string {
	const responses = [
		'Yes', 'Always', 'Yeah', 'No',
		'bro does it look like that could ever be a yes', 'legit no lmao', 'Maybe', 'Never',
		'Yep', 'tbh I don\'t think so', 'yeee ofc',
		'my mans... *no*', 'ngl very doubtful about it', 'eh don\'t count on it', 'yes chief'
	];

	return responses[Math.floor(Math.random() * responses.length)];
}

export default EightBallCommand;