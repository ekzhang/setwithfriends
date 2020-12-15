import { Model } from "objection";
import knex from "knex";

import knexfile from "../knexfile";

function objection(app) {
  const environment = process.env.NODE_ENV || "development";
  const db = knex(knexfile[environment]);

  Model.knex(db);
  app.set("knex", db);
}

export default objection;
