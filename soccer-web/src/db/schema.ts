import {
  pgTable,
  serial,
  text,
  varchar,
  timestamp,
  boolean,
  integer,
  foreignKey,
} from "drizzle-orm/pg-core";

// Users table
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  passwordHash: varchar("password_hash", { length: 255 }).notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  photoUrl: text("photo_url"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// Groups table
export const groups = pgTable("groups", {
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// GroupMembers table
export const groupMembers = pgTable(
  "group_members",
  {
    id: serial("id").primaryKey(),
    groupId: integer("group_id").notNull(),
    userId: integer("user_id").notNull(),
    isManager: boolean("is_manager").default(false).notNull(),
    joinedAt: timestamp("joined_at").defaultNow().notNull(),
  },
  (table) => [
    foreignKey({
      columns: [table.groupId],
      foreignColumns: [groups.id],
    }).onDelete("cascade"),
    foreignKey({
      columns: [table.userId],
      foreignColumns: [users.id],
    }).onDelete("cascade"),
  ]
);

// Matches table
export const matches = pgTable(
  "matches",
  {
    id: serial("id").primaryKey(),
    groupId: integer("group_id").notNull(),
    date: timestamp("date").notNull(),
    location: varchar("location", { length: 255 }).notNull(),
    capacity: integer("capacity").notNull(),
    canceled: boolean("canceled").default(false).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => [
    foreignKey({
      columns: [table.groupId],
      foreignColumns: [groups.id],
    }).onDelete("cascade"),
  ]
);

// MatchJoins table
export const matchJoins = pgTable(
  "match_joins",
  {
    id: serial("id").primaryKey(),
    matchId: integer("match_id").notNull(),
    userId: integer("user_id").notNull(),
    extraSlots: integer("extra_slots").default(0).notNull(),
    joinedAt: timestamp("joined_at").defaultNow().notNull(),
  },
  (table) => [
    foreignKey({
      columns: [table.matchId],
      foreignColumns: [matches.id],
    }).onDelete("cascade"),
    foreignKey({
      columns: [table.userId],
      foreignColumns: [users.id],
    }).onDelete("cascade"),
  ]
);

// MatchComments table
export const matchComments = pgTable(
  "match_comments",
  {
    id: serial("id").primaryKey(),
    matchId: integer("match_id").notNull(),
    userId: integer("user_id").notNull(),
    text: text("text").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => [
    foreignKey({
      columns: [table.matchId],
      foreignColumns: [matches.id],
    }).onDelete("cascade"),
    foreignKey({
      columns: [table.userId],
      foreignColumns: [users.id],
    }).onDelete("cascade"),
  ]
);
