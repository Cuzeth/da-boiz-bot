import DaBoizClient from './Structures/DaBoizClient';
import config from './config.json';
import 'dotenv/config';
const client = new DaBoizClient(config);
client.start();