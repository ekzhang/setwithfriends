import { getDatabase } from "firebase-admin/database";
import inquirer from "inquirer";

import { databaseIterator } from "./utils.js";

function displayUser(user) {
  const name = user.child("name").val();
  const lastOnline = new Date(
    user.child("lastOnline").val(),
  ).toLocaleDateString();
  return `${name} (last online: ${lastOnline})`;
}

export async function listAdmins() {
  for await (const [userId, user] of databaseIterator("users")) {
    if (user.child("admin").val()) {
      console.log(userId, displayUser(user));
    }
  }
}

export async function listPatrons() {
  for await (const [userId, user] of databaseIterator("users")) {
    if (user.child("patron").val()) {
      console.log(userId, displayUser(user));
    }
  }
}

export async function toggleAdmin() {
  const { userId } = await inquirer.prompt([
    { type: "input", name: "userId", message: "Enter the user ID:" },
  ]);

  const user = await getDatabase().ref(`users/${userId}`).get();
  console.log(displayUser(user));

  if (user.child("admin").val()) {
    const { confirm } = await inquirer.prompt([
      {
        type: "confirm",
        name: "confirm",
        message: "User is admin, do you want to remove admin status?",
      },
    ]);
    if (confirm) {
      await getDatabase().ref(`users/${userId}/admin`).remove();
    }
  } else {
    const { confirm } = await inquirer.prompt([
      {
        type: "confirm",
        name: "confirm",
        message: "User is not admin, do you want to grant admin status?",
      },
    ]);
    if (confirm) {
      await getDatabase().ref(`users/${userId}/admin`).set(true);
    }
  }
}
