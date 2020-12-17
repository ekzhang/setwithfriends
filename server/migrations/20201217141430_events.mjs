import knex from "knex";

/** @param {knex} knex */
export async function up(knex) {
  return knex.schema.createTable("events", (table) => {
    table.increments("id").primary();
    table.timestamp("time").notNullable().defaultTo(knex.fn.now());
    table.string("userId").notNullable().references("users");
    table.string("gameId").notNullable().references("games");
    table.enu("kind", ["join", "move"]).notNullable();
    table.jsonb("data");
    table.index("time");
    table.index(["userId", "gameId"]);
  });
}

/** @param {knex} knex */
export async function down(knex) {
  return knex.schema.dropTable("events");
}
