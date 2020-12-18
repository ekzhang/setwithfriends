import { Model } from "objection";
import User from "./User";

class Game extends Model {
  static tableName = "games";

  static jsonSchema = {
    type: "object",
    required: ["hostId", "status", "access", "deck"],
    properties: {
      id: { type: "string", minLength: 1, maxLength: 255 },
      hostId: { type: "string", minLength: 1, maxLength: 255 },
      createdAt: { type: "string", format: "date-time" },
      startedAt: { type: "string", format: "date-time" },
      endedAt: { type: "string", format: "date-time" },
      status: { type: "string", enum: ["waiting", "ingame", "done"] },
      access: { type: "string", enum: ["public", "private"] },
      deck: { type: "array", items: { type: "string" } },
    },
  };

  static relationMappings = {
    host: {
      relation: Model.BelongsToOneRelation,
      modelClass: User,
      join: {
        from: "games.hostId",
        to: "users.id",
      },
    },
  };

  $beforeInsert() {
    this.createdAt = new Date().toISOString();
  }
}

export default Game;
