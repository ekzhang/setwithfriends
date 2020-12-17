import knex from "knex";

/** @param {knex} knex */
export async function up(knex) {
  return knex.schema.createTable("games", (table) => {
    table.string("id").primary();
    table.string("hostId").notNullable().references("users");
    table.timestamp("createdAt").notNullable().defaultTo(knex.fn.now());
    table.timestamp("startedAt");
    table.timestamp("endedAt");
    table
      .enu("status", ["waiting", "ingame", "done"])
      .notNullable()
      .defaultTo("waiting");
    table.enu("access", ["public", "private"]).notNullable();
    table.jsonb("deck").notNullable();
    table.index("hostId");
    table.index("createdAt");
  });
}

/** @param {knex} knex */
export async function down(knex) {
  return knex.schema.dropTable("games");
}
