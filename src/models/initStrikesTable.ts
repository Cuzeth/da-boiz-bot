import mysql from 'mysql2/promise';

// Function to initialize the `strikes` table
export async function initStrikesTable(db: mysql.Connection) {
	await db.query(`
		CREATE TABLE IF NOT EXISTS strikes (
			id INT AUTO_INCREMENT PRIMARY KEY,
			guildID VARCHAR(255),
			userID VARCHAR(255),
			strikeCount INT DEFAULT 0
		)
	`);
}