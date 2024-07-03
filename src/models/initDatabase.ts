import mysql from 'mysql2/promise';
import { initGuildSettingsTable } from './initGuildSettingsTable';
import { initCasesTable } from './initCasesTable';
import { initStrikesTable } from './initStrikesTable';

export async function initDatabase() {
    const db = await mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
    });

    console.log('MySQL Database Connected.');

    await initGuildSettingsTable(db);
    await initCasesTable(db);
    await initStrikesTable(db);

    return db;
}
