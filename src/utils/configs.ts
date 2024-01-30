import { config } from 'dotenv';

config();

const configs = {
  DBFILE: process.env.DBFILE || '/tmp/db.sqlite3',
};

export { configs };
