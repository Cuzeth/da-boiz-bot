import { Guild } from 'discord.js';
import DaBoizClient from '../../Structures/DaBoizClient';
import Event from '../../Structures/Event';

module.exports = class extends Event {

	constructor(client: DaBoizClient) {
		super(client, {
			name: 'guildDelete'
		});
	}

	async run(guild: Guild) {
		const db = this.client.utils.db;
		const guildId = guild.id;

		try {
			await db.query('DELETE FROM guild_settings WHERE gid = ?', [guildId]);
			await db.query('DELETE FROM strikes WHERE guildID = ?', [guildId]);
			await db.query('DELETE FROM cases WHERE guildID = ?', [guildId]);
		} catch (error) {
			console.error(`Error deleting guild data for guild ID ${guildId}:`, error);
		}
	}
};