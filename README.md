# setwithfriends

Online, real-time [Set](<https://en.wikipedia.org/wiki/Set_(card_game)>)
application hosted on Firebase.

[Play it here!](https://setwithfriends.com/)

Made by [Eric Zhang](https://github.com/ekzhang) and
[Cynthia Du](https://github.com/cynthiakedu).

## Technical Details

This app was built with a serverless architecture, using the
[Firebase Javascript SDK](https://firebase.google.com/docs/reference/js). The
frontend was built with [React](https://reactjs.org/), with components from
[Material UI](https://material-ui.com/).

## Roadmap

This section has been moved to [TODO.md](TODO.md).

## Realtime DB Structure

The structure of the realtime database is described below.

- root (setwithfriends)
  - **games**
    - _game id_
      - history: [timestamped list of score events]
      - deck: [array of cards]
      - meta
        - admin: [user id]
        - created: [time stamp]
        - started: [time stamp]
        - status: ['waiting' or 'ingame' or 'done']
        - users:
          - _user id_: { name, color }
  - **users**
    - _user id_
      - games: [list of game ids]
      - color: [last used color]
      - name: [last used name]
  - **chats**
    - _chat id_: [list of messages]
