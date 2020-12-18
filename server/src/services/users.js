// Initializes the `users` service on path `/users`
import createService from "feathers-objection";
import User from "../models/User";

import { authenticate } from "@feathersjs/authentication";
import { disallow, iff, preventChanges } from "feathers-hooks-common";
import { setField } from "feathers-authentication-hooks";
import checkPermissions from "feathers-permissions";

const hooks = {
  before: {
    all: [authenticate("firebase")],
    find: [],
    get: [],
    create: [disallow("external")],
    update: [checkPermissions({ roles: ["admin"] })],
    patch: [
      checkPermissions({ roles: ["admin"], error: false }),
      // If not an admin, only allow user to patch their own data,
      // except for the `permissions` and `banned` columns.
      iff(
        (context) => !context.params.permitted,
        setField({ from: "params.user.id", as: "params.query.id" }),
        preventChanges(true, "permissions", "banned")
      ),
    ],
    remove: [disallow()],
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
