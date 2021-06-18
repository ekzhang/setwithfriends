# Set with Friends

![Logo](https://i.imgur.com/YTldFYX.png)

This is the source code for [Set with Friends](https://setwithfriends.com/), an
online, multiplayer implementation of the real-time card game
[Set](<https://en.wikipedia.org/wiki/Set_(card_game)>). Your goal is to find
triplets of cards that follow a certain pattern as quickly as possible.

- [Web version](https://setwithfriends.com/)
- [Official Discord](https://discord.gg/XbjJyc9)

## Technical Details

This app was built on a serverless stack primarily using the
[Firebase Realtime Database](https://firebase.google.com/docs/database), along
with [Firebase Cloud Functions](https://firebase.google.com/docs/functions) for
more complex or sensitive operations. The frontend was built with
[React](https://reactjs.org/), with components from
[Material UI](https://material-ui.com/).

Code for the frontend is written in JavaScript and located in the `src/` folder,
while serverless functions are written in TypeScript and located in the
`functions/` folder.

The latest development version of the code is on the `main` branch. We use
GitHub Actions to automate our build and deployment process on Netlify, after a
new release is created with version number `vA.B.C`.

## Contributing

This game is in active development, and we welcome contributions from developers
of all backgrounds. I would recommend talking to us on Discord (link above) or
submitting an issue if you want to see a new feature added. If you would like to
help by contributing code, that's great – we would be happy to set up a time to
chat!

To build the site for development:

- Install Node.js 14 and npm 7.
- Run `npm install -g firebase-tools` to globally install the Firebase CLI.
- Run `npm install` in the root folder to get dependencies.
- Run `npm install` in the `functions` folder.
- To start the project, run `npm run dev`. This runs a script, which is
  responsible for doing several things concurrently:
  - Build the TypeScript cloud functions in watch mode.
  - Start the Firebase Local Emulator Suite.
  - Start the frontend with React Fast Refresh enabled.

You should also be able to access the Emulator UI at `http://localhost:4000`,
which contains useful information and allows you to inspect/modify the database
during development. Changes to client code in `src` should be immediately
visible, as well as changes to code in `functions`.

Please make all pull requests with new features or bugfixes to the `main`
branch. We are formatting code using [Prettier](https://prettier.io/), so you
should run `npm run format` on your code before making a pull request.

## Deployment

As mentioned above, the latest changes to the `main` branch are deployed
automatically to Netlify using the `npm run build` script. If you try to run
this locally, it will not work due to protections on the production database.
Instead, you can preview a release build configured to connect to the local
emulator suite using the `npm run build:dev` script.

The other parts of the app (serverless functions, database rules) are deployed
to production using GitHub Actions on the `main` branch. The
[staging environment](https://setwithfriends-dev.web.app/) gets automatic deploy
previews when CI on the `main` branch passes. It is useful for seeing the latest
version of the app and making sure that nothing is broken before releasing to
production.

## License

Built by [Eric Zhang](https://github.com/ekzhang) and
[Cynthia Du](https://github.com/cynthiakedu).

All source code is available under the [MIT License](LICENSE.txt). We are not
affiliated with _Set Enterprises, Inc._, or the SET® card game.
