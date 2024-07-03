import { CommandInteraction, ColorResolvable } from 'discord.js';
import DaBoizClient from './DaBoizClient';

class Command {
	client: DaBoizClient;
	name: string;
	description: string;
	options: Array<any>;
	permissions: any;
	userPermissions: any;
	modRolePass: boolean;
	cooldown: number;
	category: string;
	usage: string;
	usable: string;
	devOnly: boolean;

	constructor(client: DaBoizClient, options: CommandOptions) {
		this.client = client;
		this.name = options.name;
		this.description = options.description || "No description provided.";
		this.options = options.options || [];
		this.permissions = options.permissions;
		this.userPermissions = options.userPermissions;
		this.modRolePass = options.modRolePass || false;
		this.cooldown = options.cooldown || 3;
		this.category = options.category;
		this.usage = options.usage || "No usage provided.";
		this.usable = options.usable || "Dev";
		this.devOnly = options.devOnly || false;
	}

	async run(interaction: CommandInteraction, context: CommandContext): Promise<any> {
		throw new Error(`Command ${this.name} doesn't provide a run method.`);
	}
}

export interface CommandContext {
	args: any;
	sicon: string;
	maincolor: ColorResolvable;
}

export interface CommandOptions {
	name: string;
	description?: string;
	options?: Array<any>;
	permissions?: any;
	userPermissions?: any;
	modRolePass?: boolean;
	cooldown?: number;
	category: string;
	usage?: string;
	usable?: string;
	devOnly?: boolean;
}

export default Command;