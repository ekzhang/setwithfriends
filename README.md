# Set with Friends

![Logo](https://i.imgur.com/YTldFYX.png)

This is the source code for [Set with Friends](https://setwithfriends.com/), an
online, multiplayer implementation of the real-time card game
[Set](<https://en.wikipedia.org/wiki/Set_(card_game)>). Your goal is to find
triplets of cards that follow a certain pattern as quickly as possible.

- [Web version](https://setwithfriends.com/)
- [Official Discord](https://discord.gg/XbjJyc9)

## Technical Details

This app was built with [Feathers.js](https://feathersjs.com/) on the server,
which provides real-time functionality through HTTP and WebSocket transports.
The backend connects to [PostgreSQL](https://www.postgresql.org/) using
[Knex](https://knexjs.org/) and
[Objection](https://vincit.github.io/objection.js/). The frontend was built with
[React](https://reactjs.org/), with components from
[Material UI](https://material-ui.com/).

An earlier version of this site was built using
[Firebase](https://firebase.google.com/) on the backend. We have since
transitioned away from Firebase; however, it is still used for Analytics and
Authentication services.

Code for the frontend is written in JavaScript and located in the `client/`
folder, while backend code is located in the `server/` folder.

The latest development version of the code is in the `master` branch. Whenever a
tagged version is released, the production frontend site is automatically
deployed to Netlify, and the backend is deployed from the same branch through a
Docker image. Continuous integration (linting and testing) is generously
provided by GitHub Actions.

## Contributing

This app is in active development, and we welcome contributions from developers
of all backgrounds. I would recommend sending a message to our Discord (link
above) or submitting an issue if you want to see a new feature added. If you
would like to help by contributing code, that's great – we would be happy to set
up a time to chat!

To build the site for development:

- Install Node.js v14, NPM v6, and PostgreSQL v13
- Run `npm install` in the root folder
- Run `npm --prefix client install` and `npm --prefix server install`
- Run `createdb setwithfriends` to initialize the local database
- Run `npm start` - it should now open the site in your browser

Please make all pull requests with new features or bugfixes to the `master`
branch. We are formatting code using [Prettier](https://prettier.io/), so you
should run `npm run format` on your code before making a pull request.

## License

Built by [Eric Zhang](https://github.com/ekzhang) and
[Cynthia Du](https://github.com/cynthiakedu).

All source code is available under the [MIT License](LICENSE.txt). We are not
affiliated with _Set Enterprises, Inc._, or the SET® card game.
