import knex from "knex";

/** @param {knex} knex */
export async function up(knex) {
  return knex.schema.createTable("chats", (table) => {
    table.increments("id").primary();
    table.string("userId").notNullable().references("users");
    table.text("message").notNullable();
    table.timestamp("time").notNullable().defaultTo(knex.fn.now());
    table.string("gameId").references("games");
    table.index("userId");
    table.index("gameId");
  });
}

/** @param {knex} knex */
export async function down(knex) {
  return knex.schema.dropTable("chats");
}
