import admin from "firebase-admin";
import inquirer from "inquirer";

import { listAdmins, listPatrons } from "./listUsers";
import { sanitizeNames } from "./sanitizeNames";

// Add scripts as functions to this array
const scripts = [listAdmins, listPatrons, sanitizeNames];

admin.initializeApp({
  credential: admin.credential.cert("./credential.json"),
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

main().then(() => require("process").exit());
