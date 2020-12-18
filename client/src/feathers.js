import feathers from "@feathersjs/feathers";
import primusClient from "@feathersjs/primus-client";
import authClient from "@feathersjs/authentication-client";
import Primus from "primus-client";

const client = feathers();

const socket = new Primus(
  process.env.NODE_ENV === "development"
    ? "http://localhost:5000"
    : "https://api.setwithfriends.com"
);

client.configure(primusClient(socket));
client.configure(authClient());

export default client;
