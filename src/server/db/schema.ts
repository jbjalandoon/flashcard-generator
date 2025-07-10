import { relations, sql } from "drizzle-orm";
import { index, mysqlTableCreator, primaryKey } from "drizzle-orm/mysql-core";
import { type AdapterAccount } from "next-auth/adapters";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = mysqlTableCreator((name) => `${name}`);

export const users = createTable("user", (d) => ({
  id: d
    .varchar({ length: 255 })
    .notNull()
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: d.varchar({ length: 255 }),
  email: d.varchar({ length: 255 }).notNull(),
  emailVerified: d
    .timestamp({
      mode: "date",
      fsp: 3,
    })
    .default(sql`CURRENT_TIMESTAMP(3)`),
  image: d.varchar({ length: 255 }),
}));

export const usersRelations = relations(users, ({ many }) => ({
  accounts: many(accounts),
  sessions: many(sessions),
  flashcards: many(flashcards),
}));

export const accounts = createTable(
  "account",
  (d) => ({
    userId: d
      .varchar({ length: 255 })
      .notNull()
      .references(() => users.id),
    type: d.varchar({ length: 255 }).$type<AdapterAccount["type"]>().notNull(),
    provider: d.varchar({ length: 255 }).notNull(),
    providerAccountId: d.varchar({ length: 255 }).notNull(),
    refresh_token: d.text(),
    access_token: d.text(),
    expires_at: d.int(),
    token_type: d.varchar({ length: 255 }),
    scope: d.varchar({ length: 255 }),
    id_token: d.text(),
    session_state: d.varchar({ length: 255 }),
  }),
  (t) => [
    primaryKey({
      columns: [t.provider, t.providerAccountId],
    }),
    index("account_user_id_idx").on(t.userId),
  ],
);

export const accountsRelations = relations(accounts, ({ one }) => ({
  user: one(users, { fields: [accounts.userId], references: [users.id] }),
}));

export const sessions = createTable(
  "session",
  (d) => ({
    sessionToken: d.varchar({ length: 255 }).notNull().primaryKey(),
    userId: d
      .varchar({ length: 255 })
      .notNull()
      .references(() => users.id),
    expires: d.timestamp({ mode: "date" }).notNull(),
  }),
  (t) => [index("session_user_id_idx").on(t.userId)],
);

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, { fields: [sessions.userId], references: [users.id] }),
}));

export const verificationTokens = createTable(
  "verification_token",
  (d) => ({
    identifier: d.varchar({ length: 255 }).notNull(),
    token: d.varchar({ length: 255 }).notNull(),
    expires: d.timestamp({ mode: "date" }).notNull(),
  }),
  (t) => [primaryKey({ columns: [t.identifier, t.token] })],
);

export const flashcards = createTable(
  "flashcards",
  (d) => ({
    id: d.bigint({ mode: "number" }).primaryKey().autoincrement(),
    title: d.varchar({ length: 255 }).notNull(),
    createdBy: d
      .varchar({ length: 255 })
      .references(() => users.id, { onDelete: "set null" })
      .default(sql`NULL`),
    createAt: d
      .timestamp()
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
  }),
  (t) => [index("flashcard_user_id_idx").on(t.createdBy)],
);

// TODO: maybe some tagging in the future
export const cards = createTable(
  "cards",
  (d) => ({
    id: d.bigint({ mode: "number" }).primaryKey().autoincrement(),
    flashcardId: d
      .bigint({ mode: "number" })
      .notNull()
      .references(() => flashcards.id, { onDelete: "cascade" }),
    question: d.varchar({ length: 255 }).notNull(),
    answer: d.varchar({ length: 255 }).notNull(),
  }),
  (t) => [index("card_flashcard_id_idx").on(t.flashcardId)],
);

export const cardsRelations = relations(cards, ({ one }) => ({
  flashcard: one(flashcards, {
    fields: [cards.flashcardId], // FK column on `cards`
    references: [flashcards.id], // PK column on `flashcards`
  }),
}));

export const flashcardsRelations = relations(flashcards, ({ many, one }) => ({
  cards: many(cards),
  user: one(users, { fields: [flashcards.createdBy], references: [users.id] }),
  subjects: many(flashcardSubjects),
}));

export const flashcardSubjects = createTable(
  "flashcardSubjects",
  (d) => ({
    id: d.bigint({ mode: "number" }).primaryKey().autoincrement(),
    flashcardId: d
      .bigint({ mode: "number" })
      .references(() => flashcards.id, { onDelete: "cascade" })
      .notNull(),
    subject: d.varchar({ length: 255 }).notNull(),
  }),
  (t) => [index("flashcard_subject_idx").on(t.flashcardId, t.subject)],
);
export const flashcardSubjectsRelations = relations(
  flashcardSubjects,
  ({ one }) => ({
    flashcard: one(flashcards, {
      fields: [flashcardSubjects.flashcardId],
      references: [flashcards.id],
    }),
  }),
);
