import { serial, varchar, integer, pgTable, text } from "drizzle-orm/pg-core";

export const nodes = pgTable("nodes", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  type: varchar("type", { length: 50 }).notNull(),
});

export const children = pgTable("children", {
  parentId: integer("parent_id")
    .notNull()
    .references(() => nodes.id),
  childId: integer("child_id")
    .notNull()
    .references(() => nodes.id),
});

export const fileContents = pgTable("file_contents", {
  nodeId: integer("node_id")
    .primaryKey()
    .references(() => nodes.id),
  content: text("content").notNull(),
});
