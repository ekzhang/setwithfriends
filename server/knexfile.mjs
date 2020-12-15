export default {
  development: {
    client: "pg",
    connection: "postgres://localhost:5432/setwithfriends",
    migrations: {
      loadExtensions: [".mjs"],
    },
  },
  production: {
    client: "pg",
    connection: process.env.DATABASE_URL,
    migrations: {
      loadExtensions: [".mjs"],
    },
  },
};
