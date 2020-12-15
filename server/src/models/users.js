// See https://vincit.github.io/objection.js/#models
// for more of what you can do here.
import { Model } from "objection";

class Users extends Model {
  static get tableName() {
    return "users";
  }

  static get jsonSchema() {
    return {
      type: "object",
      required: ["password"],

      properties: {
        email: { type: ["string", "null"] },
        password: "string",

        googleId: { type: "string" },
      },
    };
  }

  $beforeInsert() {
    this.createdAt = this.updatedAt = new Date().toISOString();
  }

  $beforeUpdate() {
    this.updatedAt = new Date().toISOString();
  }
}

export default Users;
