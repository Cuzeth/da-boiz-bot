import mysql from 'mysql2/promise';

// Function to initialize the `cases` table
export async function initCasesTable(db: mysql.Connection) {
	await db.query(`
		CREATE TABLE IF NOT EXISTS cases (
			id INT AUTO_INCREMENT PRIMARY KEY,
			guildID VARCHAR(255),
			userID VARCHAR(255),
			modID VARCHAR(255),
			type VARCHAR(255),
			duration DATETIME,
			reason TEXT
		)
	`);
}