import admin from "firebase-admin";

export async function listAdmins() {
  const admins = await admin
    .database()
    .ref("users")
    .orderByChild("admin")
    .equalTo(true)
    .once("value");
  return admins.val();
}

export async function listPatrons() {
  const patrons = await admin
    .database()
    .ref("users")
    .orderByChild("patron")
    .startAt(true)
    .once("value");
  return patrons.val();
}
