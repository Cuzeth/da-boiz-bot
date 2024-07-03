import DaBoizClient from '../../Structures/DaBoizClient';
import Event from '../../Structures/Event';
module.exports = class extends Event {

	constructor(client: DaBoizClient) {
		super(client, {
			name: 'warn'
		});
	}

	async run(info: any) {
		console.warn(info)
		console.log(`At ${new Date()}`)
	}
}