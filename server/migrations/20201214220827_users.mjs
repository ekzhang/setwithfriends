import knex from "knex";

/** @param {knex} knex */
export function up(knex) {
  return knex.schema.createTable("users", (table) => {
    table.string("id").primary();
    table.string("color").notNullable();
    table.string("name").notNullable();
    table.timestamp("lastOnline");
    table.jsonb("connections").notNullable().defaultTo({});
    table.enu("role", ["regular", "admin"]).notNullable().defaultTo("regular");
    table.timestamp("banned");
  });
}

/** @param {knex} knex */
export function down(knex) {
  return knex.schema.dropTable("users");
}
