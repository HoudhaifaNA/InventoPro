import type { Config } from 'drizzle-kit';


export default {
  schema: './db/schema/index.ts',
  out: './drizzle',
  driver: 'better-sqlite',
  dbCredentials: {
    url: process.env.DB_URL!,
  },
} satisfies Config;
