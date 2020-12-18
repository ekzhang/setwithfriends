import knex from "knex";

/** @param {knex} knex */
export function up(knex) {
  return knex.schema.createTable("users", (table) => {
    table.string("id").primary();
    table.string("name").notNullable();
    table.string("email");
    table.string("color").notNullable();
    table.timestamp("lastOnline");
    table.jsonb("connections").notNullable().defaultTo({});
    table.jsonb("permissions").notNullable().defaultTo([]);
    table.timestamp("banned");
  });
}

/** @param {knex} knex */
export function down(knex) {
  return knex.schema.dropTable("users");
}
