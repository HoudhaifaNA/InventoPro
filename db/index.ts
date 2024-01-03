import path from 'node:path';
import { drizzle, BetterSQLite3Database } from 'drizzle-orm/better-sqlite3';
import Database from 'better-sqlite3';

import * as schema from './schema';

let dbPath = path.join(path.resolve(), 'db', process.env.DB_URL!);

if (process.env.NODE_ENV === 'production') dbPath = path.join(path.resolve(), '../../db', process.env.DB_URL!);

const sqlite = new Database(dbPath);
export const db: BetterSQLite3Database<typeof schema> = drizzle(sqlite, { schema });
