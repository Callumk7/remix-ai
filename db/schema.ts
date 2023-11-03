import { relations } from "drizzle-orm";
import { integer, primaryKey, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const users = sqliteTable("users", {
	id: integer("id").primaryKey(),
	fullName: text("full_name"),
	email: text("email").notNull(),
	password: text("password").notNull(),
});

export const nodes = sqliteTable("nodes", {
	id: integer("id").primaryKey(),
	body: text("body").notNull(),
	type: text("type").notNull(),
});

export const nodeRelations = relations(nodes, ({ many }) => ({
	from: many(nodeLinks, {
		relationName: "from_node_id",
	}),
	to: many(nodeLinks, {
		relationName: "to_node_id",
	}),
}));

export const nodeLinks = sqliteTable(
	"node_links",
	{
		fromId: integer("from_id")
			.notNull()
			.references(() => nodes.id),
		toId: integer("to_id")
			.notNull()
			.references(() => nodes.id),
	},
	(t) => ({
		pk: primaryKey(t.fromId, t.toId),
	}),
);

export const nodeLinksRelations = relations(nodeLinks, ({ one }) => ({
	from: one(nodes, {
		fields: [nodeLinks.fromId],
		references: [nodes.id],
		relationName: "from_node_id",
	}),
	to: one(nodes, {
		fields: [nodeLinks.toId],
		references: [nodes.id],
		relationName: "to_node_id",
	}),
}));
