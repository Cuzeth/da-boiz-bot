import { CommandInteraction, ApplicationCommandOptionType, CommandInteractionOptionResolver, Emoji } from 'discord.js';
import DaBoizClient from '../../Structures/DaBoizClient';
import Command, { CommandContext, CommandOptions } from '../../Structures/Command';

class ChurCommand extends Command {
	constructor(client: DaBoizClient) {
		const options: CommandOptions = {
			name: 'chur',
			description: 'chur.',
			category: 'fun',
			usage: '/chur [anything]',
			usable: 'Everyone.',
			options: [
				{
					name: 'thing',
					type: ApplicationCommandOptionType.String,
					description: 'The thing to chur check',
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
		const firstChoices = ["churing...", "Assessing Chur Violation history...", "Assessing past Churs..."];
		const secondChoices = ["Checking churs...", "Placing under chur quarantine...", "Calling Shaq..."];
		const thirdChoices = ["Checking chur...", "Looking at Churs...", "Running scan from Chur database..."];
		const fourthChoices = ["Finding chur...", "Hiring Churers...", "Collecting cares..."];
		const fifthChoices = ["Running chur trial...", "Talking to Shaq...", "Checking the Chur Code..."];

		const firstChoice = firstChoices[Math.floor(pick * firstChoices.length)];
		const secondChoice = secondChoices[Math.floor(pick * secondChoices.length)];
		const thirdChoice = thirdChoices[Math.floor(pick * thirdChoices.length)];
		const fourthChoice = fourthChoices[Math.floor(pick * fourthChoices.length)];
		const fifthChoice = fifthChoices[Math.floor(pick * fifthChoices.length)];

		const chur = this.client.emojis.cache.find((emoji: Emoji) => emoji.id === "751394738313363508");

		const random = Math.floor(Math.random() * 100) + 1;
		await interaction.reply(`Checking ${personThing}'s chur...`);
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
		if (random < 25) {
			await interaction.editReply("chur failed. chur");
		} else if (random < 60) {
			await interaction.editReply(`${personThing} failed the chur check with ${random}% chur.`);
		} else {
			await interaction.editReply(`${personThing} passed the chur check with ${random}% chur${chur}`);
		}
	}
}

function delay(ms: number): Promise<void> {
	return new Promise(resolve => setTimeout(resolve, ms));
}

export default ChurCommand;
