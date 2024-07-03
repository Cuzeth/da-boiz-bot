import { RateLimitData } from 'discord.js'
import DaBoizClient from '../../Structures/DaBoizClient';
import Event from '../../Structures/Event';
module.exports = class extends Event {

	constructor(client: DaBoizClient) {
		super(client, {
			name: 'rateLimit'
		});
	}

	async run(rateLimitInfo: RateLimitData) {
		await console.log(`Ratelimited. Timeout: ${rateLimitInfo.sublimitTimeout}. Limit: ${rateLimitInfo.limit}. Method: ${rateLimitInfo.method}.`)
	}
}