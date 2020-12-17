import { Model } from "objection";
import Game from "./Game";
import Chat from "./Chat";

class User extends Model {
  static tableName = "users";

  static jsonSchema = {
    type: "object",
    required: ["name", "color"],
    properties: {
      id: { type: "string", minLength: 1, maxLength: 255 },
      name: { type: "string", minLength: 1, maxLength: 255 },
      color: { type: "string", minLength: 1, maxLength: 255 },
      lastOnline: { type: ["string", "null"], format: "date-time" },
      connections: {
        type: "object",
        additionalProperties: { type: "string" },
      },
      role: { type: "string", pattern: "^(regular|admin)$" },
      banned: { type: ["string", "null"], format: "date-time" },
    },
  };

  static relationMappings = {
    games: {
      relation: Model.ManyToManyRelation,
      modelClass: Game,
      join: {
        from: "users.id",
        through: {
          from: "events.userId",
          to: "events.gameId",
        },
        to: "games.id",
      },
    },

    hosted: {
      relation: Model.HasManyRelation,
      modelClass: Game,
      join: {
        from: "users.id",
        to: "games.hostId",
      },
    },

    chats: {
      relation: Model.HasManyRelation,
      modelClass: Chat,
      join: {
        from: "users.id",
        to: "chats.userId",
      },
    },
  };
}

export default User;
