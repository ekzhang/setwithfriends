import { cert, initializeApp } from "firebase-admin/app";
import inquirer from "inquirer";
import process from "node:process";

import { fixGames } from "./fixGames.js";
import { sanitizeNames } from "./sanitizeNames.js";
import { listAdmins, listPatrons, toggleAdmin } from "./users.js";

// Add scripts as functions to this array
const scripts = [listAdmins, listPatrons, toggleAdmin, sanitizeNames, fixGames];

initializeApp({
  credential: cert("./credential.json"),
  databaseURL: "https://setwithfriends.firebaseio.com",
});

async function main() {
  const { script } = await inquirer.prompt([
    {
      type: "list",
      name: "script",
      message: "Which script would you like to run?",
      choices: scripts.map((f) => ({ name: f.name, value: f })),
    },
  ]);

  const output = await script();
  if (output !== undefined) {
    console.log(output);
  }
}

main().then(() => process.exit());
