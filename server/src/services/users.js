// Initializes the `users` service on path `/users`
import createService from "feathers-objection";
import createModel from "../models/users";
import { hooks as authenticate } from "@feathersjs/authentication";
import { hooks as localHooks } from "@feathersjs/authentication-local";

const hooks = {
  before: {
    all: [],
    find: [authenticate("jwt")],
    get: [authenticate("jwt")],
    create: [localHooks.hashPassword("password")],
    update: [localHooks.hashPassword("password"), authenticate("jwt")],
    patch: [localHooks.hashPassword("password"), authenticate("jwt")],
    remove: [authenticate("jwt")],
  },

  after: {
    all: [
      // Make sure the password field is never sent to the client
      // Always must be the last hook
      localHooks.protect("password"),
    ],
  },
};

function users(app) {
  const options = {
    model: createModel(app),
    paginate: app.get("paginate"),
  };

  // Initialize our service with any options it requires
  app.use("/users", createService(options));

  // Get our initialized service so that we can register hooks
  const service = app.service("users");
  service.hooks(hooks);
}

export default users;
