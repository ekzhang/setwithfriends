# Scripts

This folder contains miscellaneous scripts that interface with the Firebase
Admin SDK to perform one-off administrative functions. To run these scripts, you
need to have the secret key credentials corresponding to a service account,
which can be done by admin users following the
[instructions here](https://firebase.google.com/docs/admin/setup). Download the
secret, and save it to a file in this folder called `credential.json`.

After downloading the credentials file, you can run scripts with `npm install`
and `npm start`.

## Structure

The scripts are written in Node.js as functions and have access to the
`firebase-admin` SDK. The entry point is `src/index.js`, which imports and lists
all of the functions. These files might be somewhat messy, but it's better to
track these tools somewhere than to not keep them at all.
