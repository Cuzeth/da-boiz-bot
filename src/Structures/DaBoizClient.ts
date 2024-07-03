import { Client, Collection, GatewayIntentBits, PermissionsBitField } from 'discord.js';
import Util from './Util';
import Cases from './Cases';
import Command from './Command';
import Event from './Event';

class DaBoizClient extends Client {

	commands: Collection<string, Command>;
	events: Collection<string, Event>;
	utils: Util;
	cases: Cases;
	defaultPerms: any;
	footerName: String;
	version: String;

	constructor(options: DaBoizOptions) {
		super({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers, GatewayIntentBits.GuildModeration, GatewayIntentBits.GuildIntegrations, GatewayIntentBits.MessageContent, GatewayIntentBits.GuildMessages, GatewayIntentBits.GuildMessageReactions, GatewayIntentBits.GuildPresences, GatewayIntentBits.GuildWebhooks] });
		this.validate(options);

		this.commands = new Collection();
		this.events = new Collection();
		this.utils = new Util(this);
		this.cases = new Cases(this);
	}

	validate(options: { defaultPerms?: any; footerName?: String; version?: String; }) {
		if (typeof options !== 'object') throw new TypeError('Options should be a type of Object.');
		if (!options.defaultPerms) throw new Error('You must pass default perm(s) for the client.');
		if (!options.footerName) throw new Error('You must pass a footerName for the client.');
		if (!options.version) throw new Error('You must pass a version number for the client.');
		this.defaultPerms = new PermissionsBitField(options.defaultPerms).freeze();
		this.footerName = String(options.footerName);
		this.version = String(options.version);
	}

	async start() {
		this.utils.loadCommands();
		this.utils.loadEvents();
		await this.utils.initDB();
		await super.login(process.env.TOKEN);
	}
}

interface DaBoizOptions {
	defaultPerms: any,
	footerName: String,
	version: String;
};

export default DaBoizClient;