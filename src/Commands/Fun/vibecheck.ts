import DaBoizClient from '../../Structures/DaBoizClient';
import Command, { CommandContext, CommandOptions } from '../../Structures/Command';
import { ApplicationCommandOptionType, CommandInteraction, EmbedBuilder, Emoji } from 'discord.js';

class VibeCheckCommand extends Command {
	constructor(client: DaBoizClient) {
		const options: CommandOptions = {
			name: 'vibecheck',
			description: 'Checks a user\'s vibe.',
			permissions: ['EmbedLinks', 'UseExternalEmojis'],
			category: 'fun',
			usage: '/vibecheck [user]',
			usable: 'Everyone.',
			options: [
				{
					name: 'user',
					type: ApplicationCommandOptionType.User,
					description: 'The user to check the vibe of',
					required: false
				},
				{
					name: 'text',
					type: ApplicationCommandOptionType.String,
					description: 'The text to check the vibe of',
					required: false
				}
			]
		};
		super(client, options);
	}

	async run(interaction: CommandInteraction, context: CommandContext): Promise<void> {
		const user = interaction.options.get('user')?.user;
		const text = interaction.options.get('text')?.value as string;

		if (text === "@everyone" || text === "@here") {
			await interaction.reply("Nice try.");
			return;
		}

		const pick = Math.random();
		const firstChoices = ["Assessing actions...", "Assessing Bro Code Violation history...", "Assessing past interactions..."];
		const secondChoices = ["Checking interactions...", "Placing under vibe quarantine...", "Calling Sheriff..."];
		const thirdChoices = ["Checking vibe...", "Looking at DMs...", "Running scan from VibeChecker™ database..."];
		const fourthChoices = ["Finding evidence...", "Hiring lawyers...", "Collecting evidence..."];
		const fifthChoices = ["Running court trial...", "Talking to judge...", "Checking the Bro Code..."];
		const firstChoice = firstChoices[Math.floor(pick * firstChoices.length)];
		const secondChoice = secondChoices[Math.floor(pick * secondChoices.length)];
		const thirdChoice = thirdChoices[Math.floor(pick * thirdChoices.length)];
		const fourthChoice = fourthChoices[Math.floor(pick * fourthChoices.length)];
		const fifthChoice = fifthChoices[Math.floor(pick * fifthChoices.length)];

		const failed = this.client.emojis.cache.find((emoji: Emoji) => emoji.id === "685861094719619102");
		const passed = this.client.emojis.cache.find((emoji: Emoji) => emoji.id === "752559338354376815");

		let personThing = text || (user ? user.username : interaction.user.username);
		personThing = this.client.utils.capitalize(personThing);
		const random = Math.floor(Math.random() * 100) + 1;
		const vibePolice = new EmbedBuilder()
			.setColor("#FF0000")
			.setDescription(`\`🚨WARNING🚨\`\n${personThing}'s Vibe has been identified in the VibeChecker™ database.\n${personThing} has missed their Vibe Court date multiple times. The Vibe Police will be here shortly.`);

		await interaction.reply(`Checking ${personThing}'s vibe...`);

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
			await interaction.editReply({ content: "\n", embeds: [vibePolice] });
			return;
		}

		if (random < 60) {
			await interaction.editReply(`${personThing} failed the vibe check with ${random}%. ${failed}`);
		} else {
			await interaction.editReply(`${personThing} passed the vibe check with ${random}%. ${passed}`);
		}
	}
}

function delay(ms: number) {
	return new Promise(resolve => setTimeout(resolve, ms));
}

export default VibeCheckCommand;