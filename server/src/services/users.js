// Initializes the `users` service on path `/users`
import createService from "feathers-objection";
import User from "../models/User";

import { authenticate } from "@feathersjs/authentication";
import { disallow } from "feathers-hooks-common";
import { setField } from "feathers-authentication-hooks";

const hooks = {
  before: {
    all: [],
    find: [],
    get: [],
    create: [disallow()],
    update: [
      authenticate("firebase"),
      setField({ from: "params.user.id", as: "params.query.id" }),
    ],
    patch: [
      authenticate("firebase"),
      setField({ from: "params.user.id", as: "params.query.id" }),
    ],
    remove: [
      authenticate("firebase"),
      setField({ from: "params.user.id", as: "params.query.id" }),
    ],
  },
};

function users(app) {
  const options = {
    model: User,
    paginate: app.get("paginate"),
  };

  // Initialize our service with any options it requires
  app.use("/users", createService(options));

  // Get our initialized service so that we can register hooks
  const service = app.service("users");
  service.hooks(hooks);
}

export default users;
