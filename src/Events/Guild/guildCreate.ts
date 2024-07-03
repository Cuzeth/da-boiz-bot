import { Guild } from 'discord.js'
import DaBoizClient from '../../Structures/DaBoizClient';
import Event from '../../Structures/Event';
module.exports = class extends Event {

	constructor(client: DaBoizClient) {
		super(client, {
			name: 'guildCreate'
		});
	}

	async run(guild: Guild) {
		console.log(`Joined new guild`);
	}
}