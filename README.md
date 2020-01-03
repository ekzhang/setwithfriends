# setwithfriends

Online, real-time set application hosted on Firebase.

Made by Eric Zhang and Cynthia Du.

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

## TODO

- [x] Migrate to Material UI
- [x] Implement basic interface/layout
- [x] Re-integrate backend
- [x] Show number of remaining cards
- [x] End-of-game screen
- [x] Modals and popups
- [x] Coherent card animations
- [ ] Firebase database rules
- [ ] Help, About, and Contact pages
- [ ] Additional features
  - [x] "Play again" button
  - [ ] Chat
  - [x] Spectating
  - [x] Statistics panel
  - [ ] Fix race conditions
  - [ ] Quick-play queueing
  - [ ] Options panel (setting color)
  - [ ] Keyboard shortcuts to select cards
  - [ ] Responsive layout
  - [ ] Wittier 404 page
