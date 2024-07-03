import mysql from 'mysql2/promise';

// Function to initialize the `guild_settings` table
export async function initGuildSettingsTable(db: mysql.Connection) {
	await db.query(`
		CREATE TABLE IF NOT EXISTS guild_settings (
			gid VARCHAR(255) PRIMARY KEY,
			modmessage VARCHAR(255) DEFAULT 'Da Boiz Moderation',
			modroleID VARCHAR(255) DEFAULT 'notset',
			modlogChannelID VARCHAR(255) DEFAULT 'notset',
			memberlogsChannelID VARCHAR(255) DEFAULT 'notset',
			userlogsChannelID VARCHAR(255) DEFAULT 'notset',
			chatlogsChannelID VARCHAR(255) DEFAULT 'notset',
			nicklogsChannelID VARCHAR(255) DEFAULT 'notset',
			rolelogsChannelID VARCHAR(255) DEFAULT 'notset'
		)
	`);
}