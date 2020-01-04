# setwithfriends

Online, real-time [Set](<https://en.wikipedia.org/wiki/Set_(card_game)>)
application hosted on Firebase.

[Play it here!](https://setwithfriends.web.app/)

Made by [Eric Zhang](https://github.com/ekzhang) and
[Cynthia Du](https://github.com/cynthiakedu).

## Technical Details

This app was built with a serverless architecture, using the
[Firebase Javascript SDK](https://firebase.google.com/docs/reference/js). The
frontend was built with [React](https://reactjs.org/), with components from
[Material UI](https://material-ui.com/).

## TODO

- [x] Migrate to Material UI
- [x] Implement basic interface/layout
- [x] Re-integrate backend
- [x] Show number of remaining cards
- [x] End-of-game screen
- [x] Modals and popups
- [x] Coherent card animations
- [x] Firebase database rules
- [x] Help, About, and Contact pages
- [ ] Pixel-perfect tweaks (e.g. padding, chat icon position)
- [ ] Additional features
  - [x] "Play again" button
  - [x] Chat
  - [x] Spectating
  - [x] Statistics panel
  - [ ] Fix race conditions
  - [ ] Quick-play queueing
  - [ ] Options panel (setting color)
  - [ ] Keyboard shortcuts to select cards
  - [ ] Responsive layout
  - [ ] Wittier 404 page
  - [ ] Prompt user to rotate screen if portrait mode

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
