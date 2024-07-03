import { ApplicationCommandDataResolvable, ChannelType, CommandInteraction, EmbedBuilder, REST, Routes, TextChannel } from 'discord.js';
import mysql from 'mysql2/promise';
import path from 'path';
import { promisify } from 'util';
const glob = promisify(require('glob'));
import Command from './Command';
import DaBoizClient from './DaBoizClient';
import Event from './Event';
import { initDatabase } from '../models/initDatabase';

const globPromise = promisify(glob);

class Util {

	client: DaBoizClient;
	db: mysql.Connection;

	constructor(client: DaBoizClient) {
		this.client = client;
	}

	isClass(input: any) {
		return typeof input === 'function' &&
			typeof input.prototype === 'object' &&
			input.toString().substring(0, 5) === 'class';
	}

	get directory() {
		return `${path.dirname(require.main.filename)}${path.sep}`;
	}

	capitalize(str: string) {
		return str.slice(0, 1).toUpperCase() + str.slice(1)
	}

	async findMessage(message: CommandInteraction, ID: string) {
		let channels = Array.from(message.guild.channels.cache.filter(c => c.type == ChannelType.GuildText).values())
		for (let current of channels) {
			let target = await (current as TextChannel).messages.fetch({ message: `${BigInt(ID)}`, cache: false, force: true }).catch((err: any) => { })
			if (target) return target;
		}
	}

	getRandomColor() {
		var letters = '0123456789ABCDEF';
		var color = '#';
		for (var i = 0; i < 6; i++) {
			color += letters[Math.floor(Math.random() * 16)];
		}
		return color;
	}

	trimArray(arr: Array<any>, maxLen: number = 10) {
		if (arr.length > maxLen) {
			const len = arr.length - maxLen;
			arr = arr.slice(0, maxLen);
			arr.push(`${len} more...`);
		}
		return arr;
	}

	formatBytes(bytes: number) {
		if (bytes === 0) return '0 Bytes';
		const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
		const i = Math.floor(Math.log(bytes) / Math.log(1024));
		return `${parseFloat((bytes / Math.pow(1024, i)).toFixed(2))} ${sizes[i]}`;
	}

	removeDuplicates(arr: Array<any>) {
		return [...new Set(arr)];
	}

	async sendEmbeds(text: string, channel: TextChannel, color?: any) {
		const arr = text.match(/.{1,2048}/g); // Build the array

		for (let chunk of arr) { // Loop through every element
			let embed = new EmbedBuilder()
				.setColor(color)
				.setDescription(chunk);

			await channel.send({ embeds: [embed] }); // Wait for the embed to be sent
		}
	}

	delay(ms: number) {
		return new Promise(resolve => setTimeout(resolve, ms));
	}

	makeid(length: number) {
		var result = '';
		var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
		var charactersLength = characters.length;
		for (var i = 0; i < length; i++) {
			result += characters.charAt(Math.floor(Math.random() * charactersLength));
		}
		return result;
	}

	formatPerms(perm: string) {
		return perm
			.replace(/([a-z])([A-Z])/g, '$1 $2') // Add space before second capital letter
			.replace(/_/g, ' ')
			.replace(/Guild/g, 'Server')
			.replace(/Use Vad/g, 'Use Voice Activity');
	}

	formatArray(array: Array<any>, type: string = 'conjunction') {
		// @ts-ignore
		return new Intl.ListFormat('en-GB', { style: 'short', type: type }).format(array);
	}

	async loadCommands(): Promise<void> {
		const commandsArray: ApplicationCommandDataResolvable[] = [];
		// @ts-ignore
		const commandFiles: string[] = await globPromise(`${this.directory}Commands/**/*.${process.env.PRODUCTION ? 'js' : 'ts'}`).then(files => files) as string[];

		console.log(`Found ${commandFiles.length} command files.`);

		for (const commandFile of commandFiles) {
			delete require.cache[commandFile];
			const { name } = path.parse(commandFile);
			const File = require(commandFile);
			const CommandClass = File.default ? File.default : File; // Ensure we get the default export if using esModuleInterop

			console.log(`Loading command ${name}`);

			if (!this.isClass(CommandClass)) throw new TypeError(`Command ${name} doesn't export a class.`);
			const command = new CommandClass(this.client, name.toLowerCase());
			if (!(command instanceof Command)) throw new TypeError(`Command ${name} doesn't belong in Commands.`);
			if (command.devOnly && process.env.PRODUCTION) continue;
			this.client.commands.set(command.name, command);
			commandsArray.push({
				name: command.name,
				description: command.description,
				options: command.options,
			});
		}

		console.log(`Loaded ${commandsArray.length} commands into application commands.`);

		this.client.application?.commands.set(commandsArray);
		const rest = new REST().setToken(process.env.TOKEN);
		if (process.env.PRODUCTION) {
			(async () => {
				try {

					// The put method is used to fully refresh all commands in the guild with the current set
					const data = await rest.put(
						Routes.applicationCommands("636595833801801748"),
						{ body: commandsArray },
					);
				} catch (error) {
					console.error(error);
				}
			})();
		}
		else {
			(async () => {
				try {

					// The put method is used to fully refresh all commands in the guild with the current set
					const data = await rest.put(
						Routes.applicationGuildCommands("686224747042045952", "636596069421154323"),
						{ body: commandsArray },
					);
				} catch (error) {
					console.error(error);
				}
			})();
		}
	}

	async loadEvents() {
		return glob(`${this.directory}Events/**/*.${process.env.PRODUCTION ? 'js' : 'ts'}`).then((events: any) => {
			for (const eventFile of events) {
				delete require.cache[eventFile];
				const { name } = path.parse(eventFile);
				const File = require(eventFile);
				if (!this.isClass(File)) throw new TypeError(`Event ${name} doesn't export a class!`);
				const event = new File(this.client, name);
				if (!(event instanceof Event)) throw new TypeError(`Event ${name} doesn't belong in Events`);
				this.client.events.set(event.name, event);
				event.emitter[event.type](name, (...args: any) => event.run(...args));
			}
		});
	}

	async initDB() {
		this.db = await initDatabase();
		this.client.utils.db = this.db;
	}
}

export default Util;