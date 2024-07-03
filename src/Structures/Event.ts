import DaBoizClient from './DaBoizClient';

class Event {

	client: DaBoizClient;
	name: string;
	type: string;
	emitter: any;

	constructor(client: DaBoizClient, options: EventOptions) {
		this.client = client;
		this.name = options.name;
		this.type = options.once ? 'once' : 'on';
		// @ts-ignore
		this.emitter = (typeof options.emitter === 'string' ? this.client[options.emitter] : options.emitter) || this.client;
	}

	async run(...args: any): Promise<any> {
		throw new Error(`The run method has not been implemented in ${this.name}`);
	}

};

interface EventOptions {
	name: string;
	once?: any;
	type?: string;
	emitter?: any;
}

export default Event;