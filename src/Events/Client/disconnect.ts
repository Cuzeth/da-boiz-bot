import DaBoizClient from '../../Structures/DaBoizClient';
import Event from '../../Structures/Event';
module.exports = class extends Event {

	constructor(client: DaBoizClient) {
		super(client, {
			name: 'disconnect'
		});
	}

	async run() {
		console.warn(`Disconnected at ${new Date}`)
	}
}