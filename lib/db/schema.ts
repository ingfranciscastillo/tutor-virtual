import {
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
  index,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// Chats table - represents a conversation session
export const chats = pgTable(
  "chats",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    userId: varchar("user_id", { length: 256 }), // Clerk user ID, nullable for guest users
    subject: varchar("subject", { length: 50 }).notNull(),
    level: varchar("level", { length: 20 }).notNull(), // primaria, secundaria, universidad
    title: varchar("title", { length: 200 }).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => ({
    userIdIndex: index("chats_user_id_idx").on(table.userId),
    subjectIndex: index("chats_subject_idx").on(table.subject),
    createdAtIndex: index("chats_created_at_idx").on(table.createdAt),
  })
);

// Messages table - represents individual messages in a chat
export const messages = pgTable(
  "messages",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    chatId: uuid("chat_id")
      .references(() => chats.id, { onDelete: "cascade" })
      .notNull(),
    content: text("content").notNull(),
    role: varchar("role", { length: 20 }).notNull(), // 'user' | 'assistant'
    userId: varchar("user_id", { length: 256 }), // Clerk user ID, nullable for guest users
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => ({
    chatIdIndex: index("messages_chat_id_idx").on(table.chatId),
    createdAtIndex: index("messages_created_at_idx").on(table.createdAt),
  })
);

// Relations
export const chatsRelations = relations(chats, ({ many }) => ({
  messages: many(messages),
}));

export const messagesRelations = relations(messages, ({ one }) => ({
  chat: one(chats, {
    fields: [messages.chatId],
    references: [chats.id],
  }),
}));

// Type exports
export type Chat = typeof chats.$inferSelect;
export type NewChat = typeof chats.$inferInsert;
export type Message = typeof messages.$inferSelect;
export type NewMessage = typeof messages.$inferInsert;
