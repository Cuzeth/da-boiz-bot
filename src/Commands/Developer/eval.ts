import { CommandInteraction, ApplicationCommandOptionType, EmbedBuilder } from 'discord.js';
import Command, { CommandContext, CommandOptions } from '../../Structures/Command';
import { inspect } from 'util';
import DaBoizClient from '../../Structures/DaBoizClient';

class EvalCommand extends Command {
	constructor(client: DaBoizClient) {
		const options: CommandOptions = {
			name: 'eval',
			description: 'Evaluates js code.',
			permissions: ['EmbedLinks'],
			cooldown: 0.1,
			devOnly: true,
			category: 'developer',
			usage: 'eval <input>',
			usable: 'Bot owner only.',
			options: [
				{
					name: 'input',
					type: ApplicationCommandOptionType.String,
					description: 'The code to evaluate',
					required: true
				}
			]
		};
		super(client, options);
	}

	async run(interaction: CommandInteraction, context: CommandContext): Promise<void> {
		if (interaction.user.id !== process.env.OWNERID) {
			await interaction.reply({ content: 'You do not have permission to use this command.', ephemeral: true });
			return;
		}

		const toEval = interaction.options.get('input')?.value as string || '';
		const formattedEval = toEval.replace(/[“”]/g, '"').replace(/[‘’]/g, "'");
		let evaluated;

		try {
			const start = process.hrtime();
			evaluated = eval(formattedEval);
			if (evaluated instanceof Promise) {
				evaluated = await evaluated;
			}
			const stop = process.hrtime(start);

			if (evaluated === "Promise { <pending> }") return;

			const evaluatedCode = new EmbedBuilder()
				.setTitle("`EVAL`")
				.setDescription(`\`\`\`js\n${inspect(evaluated, { depth: 0 })}\n\`\`\``)
				.addFields([{ name: '`TIME`', value: `\`${(((stop[0] * 1e9) + stop[1])) / 1e6}ms.\`` }])
				.setColor("Red");

			await interaction.reply({ embeds: [evaluatedCode] });

		} catch (error: any) {
			const errorMessage = new EmbedBuilder()
				.addFields([{ name: '`ERROR`', value: `\`${error.message}\`` }])
				.setColor("Red");

			await interaction.reply({ embeds: [errorMessage] });
		}
	}
}

export default EvalCommand;