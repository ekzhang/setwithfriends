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

The production site is built and hosted on Netlify from the `master` branch. The
latest development version of the code is in the `develop` branch.

## Contributing

This game is in active development, and we welcome contributions from developers
of all backgrounds. I would recommend talking to us on Discord (link above) or
submitting an issue if you want to see a new feature added. If you would like to
help by contributing code, that's great – we would be happy to set up a time to
chat!

To build the site for development:

- Install Node.js and npm
- Run `npm install` in the root folder
- Run `npm start` - it should now open the site in your browser

Please make all pull requests with new features or bugfixes to the `develop`
branch. We are formatting code using [Prettier](https://prettier.io/), so you
should run `npm run format` on your code before making a pull request.

## Deployment

As mentioned above, the latest changes to the `master` branch are deployed
automatically to Netlify using the `npm run build` script. If you try to run
this locally, it will not work due to protections on the production database.
Instead, you can preview a release build with development configuration using
the `npm run build:dev` script.

The other parts of the app (serverless functions, database rules) are deployed
to production using GitHub Actions on the master branch. They must be manually
deployed to the development environment using the Firebase CLI.

## License

Built by [Eric Zhang](https://github.com/ekzhang) and
[Cynthia Du](https://github.com/cynthiakedu).

All source code is available under the [MIT License](LICENSE.txt). We are not
affiliated with _Set Enterprises, Inc._, or the SET® card game.
