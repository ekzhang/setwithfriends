import { Model } from "objection";
import Game from "./Game";
import User from "./User";

class Event extends Model {
  static tableName = "events";

  static jsonSchema = {
    type: "object",
    required: ["time", "userId", "gameId", "kind"],
    properties: {
      id: { type: "integer" },
      time: { type: "string", format: "date-time" },
      userId: { type: "string", minLength: 1, maxLength: 255 },
      gameId: { type: "string", minLength: 1, maxLength: 255 },
      kind: { type: "string", enum: ["join", "move"] },
    },
  };

  static relationMappings = {
    user: {
      relation: Model.BelongsToOneRelation,
      modelClass: User,
      join: {
        from: "events.userId",
        to: "users.id",
      },
    },

    game: {
      relation: Model.BelongsToOneRelation,
      modelClass: Game,
      join: {
        from: "events.gameId",
        to: "games.id",
      },
    },
  };

  $beforeInsert() {
    this.time = new Date().toISOString();
  }
}

export default Event;
