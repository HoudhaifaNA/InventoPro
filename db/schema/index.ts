import { InferInsertModel, InferSelectModel } from 'drizzle-orm';
import { sqliteTable, text } from 'drizzle-orm/sqlite-core';

// export const notes = sqliteTable('notes', {
//   id: text('id').primaryKey(),
//   title: text('title').notNull(),
//   description: text('description').notNull(),
// });

// export type NoteInsert = InferInsertModel<typeof notes>;
// export type NoteSelect = InferSelectModel<typeof notes>;
