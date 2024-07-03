import DaBoizClient from './DaBoizClient';

class CasesDatabase {

	client: DaBoizClient;

	constructor(client: DaBoizClient) {
		this.client = client;
	}

	async getCases(gID: string, uID?: string) {
		let query = 'SELECT * FROM cases WHERE guildID = ?';
		const params: (string | boolean)[] = [gID];
		if (uID) {
			query += ' AND userID = ?';
			params.push(uID);
		}
		const [rows, fields] = await this.client.utils.db.query(query, params);
		return rows as any[];
	}
}

export default CasesDatabase;