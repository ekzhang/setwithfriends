import { Model } from "objection";
import knex from "knex";

function objection(app) {
  const { client, connection } = app.get("postgres");
  const db = knex({ client, connection, useNullAsDefault: false });

  Model.knex(db);
  app.set("knex", db);
}

export default objection;
