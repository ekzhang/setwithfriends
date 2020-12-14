import users from "./users";

function services(app) {
  app.configure(users);
}

export default services;
