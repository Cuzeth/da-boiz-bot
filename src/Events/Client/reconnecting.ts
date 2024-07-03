import { ActivityType } from 'discord.js';
import DaBoizClient from '../../Structures/DaBoizClient';
import Event from '../../Structures/Event';
module.exports = class extends Event {

	constructor(client: DaBoizClient) {
		super(client, {
			name: 'reconnecting'
		});
	}

	async run() {
		await this.client.user.setActivity("Reconnecting...", { type: ActivityType.Competing })
		console.warn("Reconnecting...")
	}
}