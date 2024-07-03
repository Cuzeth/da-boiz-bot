import { CommandInteraction, ApplicationCommandOptionType, CommandInteractionOptionResolver } from 'discord.js';
import DaBoizClient from '../../Structures/DaBoizClient';
import Command, { CommandContext, CommandOptions } from '../../Structures/Command';

class CareCommand extends Command {
	constructor(client: DaBoizClient) {
		const options: CommandOptions = {
			name: 'care',
			description: 'Checks a user\'s care amount.',
			category: 'fun',
			usage: '/care [anything]',
			usable: 'Everyone.',
			options: [
				{
					name: 'thing',
					type: ApplicationCommandOptionType.String,
					description: 'The thing to check for cares',
					required: false,
				},
			],
		};
		super(client, options);
	}

	async run(interaction: CommandInteraction, context: CommandContext): Promise<void> {
		const thing = (interaction.options as CommandInteractionOptionResolver).getString('thing') || interaction.user.username;
		if (thing === "@everyone" || thing === "@here") {
			await interaction.reply("Nice try.");
			return;
		}

		const personThing = this.client.utils.capitalize(thing);
		const pick = Math.random();
		const firstChoices = ["Looking for cares...", "Assessing if anyone asked...", "Assessing past cares..."];
		const secondChoices = ["Checking who asked...", "care?", "Calling care..."];
		const thirdChoices = ["Checking cares...", "Looking at cares...", "Running scan from CareChecker™ database..."];
		const fourthChoices = ["Finding people that give cares...", "Hiring people to give cares...", "Collecting cares..."];
		const fifthChoices = ["Running care simulation...", "caaareeee", "i found some cares..."];

		const firstChoice = firstChoices[Math.floor(pick * firstChoices.length)];
		const secondChoice = secondChoices[Math.floor(pick * secondChoices.length)];
		const thirdChoice = thirdChoices[Math.floor(pick * thirdChoices.length)];
		const fourthChoice = fourthChoices[Math.floor(pick * fourthChoices.length)];
		const fifthChoice = fifthChoices[Math.floor(pick * fifthChoices.length)];

		const random = Math.floor(Math.random() * 100) + 1;
		await interaction.reply(`Checking ${personThing}'s cares...`);
		await delay(1000);
		await interaction.editReply(firstChoice);
		await delay(1000);
		await interaction.editReply(secondChoice);
		await delay(1000);
		await interaction.editReply(thirdChoice);
		await delay(1000);
		await interaction.editReply(fourthChoice);
		await delay(1000);
		await interaction.editReply(fifthChoice);
		await delay(3000);
		await interaction.editReply(`${personThing} got ${random} cares.`);
	}
}

function delay(ms: number): Promise<void> {
	return new Promise(resolve => setTimeout(resolve, ms));
}

export default CareCommand;