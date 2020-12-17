import { Model } from "objection";
import User from "./User";

class Chat extends Model {
  static tableName = "chats";

  static jsonSchema = {
    type: "object",
    required: ["userId", "message", "time"],
    properties: {
      id: { type: "integer" },
      userId: { type: "string", minLength: 1, maxLength: 255 },
      message: { type: "string", minLength: 1 },
      time: { type: "string", format: "date-time" },
      roomId: { type: ["string", "null"], minLength: 1, maxLength: 255 },
    },
  };

  static relationMappings = {
    user: {
      relation: Model.BelongsToOneRelation,
      modelClass: User,
      join: {
        from: "chats.userId",
        to: "users.id",
      },
    },
  };

  $beforeInsert() {
    this.time = new Date().toISOString();
  }
}

export default Chat;
