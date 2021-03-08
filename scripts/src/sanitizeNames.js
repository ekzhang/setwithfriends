import admin from "firebase-admin";

function sanitize(name) {
  return (
    name
      .replace(/[^\p{L}\p{M}\p{N}\p{P}\p{Zs}]|[\uFE00-\uFE0F]/gu, "")
      .trim() || "Anonymous"
  );
}

export async function sanitizeNames() {
  const users = await admin.database().ref("users").orderByKey().once("value");

  const updates = [];

  users.forEach((snap) => {
    const name = snap.val().name;

    if (!name.match(/^(\p{L}|\p{M}|\p{N}|\p{P}|\p{Zs})*$/u)) {
      const sanitized = sanitize(name);
      console.log(`[${snap.key}] Replacing ${name} with ${sanitized}...`);
      updates.push(snap.ref.child("name").set(sanitized));
    }
  });

  await Promise.all(updates);
}
