const migrations = {
  loadExtensions: [".mjs"],
  stub: "migration.stub",
  extension: "mjs",
};

export default {
  development: {
    client: "pg",
    connection: "postgres://localhost:5432/setwithfriends",
    migrations,
  },
  production: {
    client: "pg",
    connection: process.env.DATABASE_URL,
    migrations,
  },
};
