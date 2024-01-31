import { config } from 'dotenv';

config();

const configs = {
  DB_FILE: process.env.DB_FILE || './database.sqlite3',
  API_PORT: process.env.API_PORT || 8080,
  MACA_EVICTION_INTERVAL_CHECK: 500,
};

export { configs };
