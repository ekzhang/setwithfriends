# setwithfriends-server

This project uses [Feathers](http://feathersjs.com). An open source web
framework for building modern real-time applications.

## Testing

Simply run `npm test` and all your tests in the `test/` directory will be run.

## Scaffolding

Feathers has a powerful command line interface. Here are a few things it can do:

```
$ npm install -g @feathersjs/cli          # Install Feathers CLI

$ feathers generate service               # Generate a new Service
$ feathers generate hook                  # Generate a new Hook
$ feathers help                           # Show all commands
```

## Help

For more information on all the things you can do with Feathers visit
[docs.feathersjs.com](http://docs.feathersjs.com).

## Database and Migrations

We use [Knex](https://knexjs.org/) for SQL query construction and migrations.
Migrations are automatically run when the app starts up. To generate and run
migrations directly, you can use the Knex CLI.

```
$ npx knex --help
$ npx knex migrate:make <name>
$ npx knex migrate:latest
$ npx knex migrate:list
$ npx knex migrate:rollback
```

The model layer is handled by
[Objection](https://vincit.github.io/objection.js/), a lightweight ORM that
builds on top of Knex.
