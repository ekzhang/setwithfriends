import { getDatabase } from "firebase-admin/database";

/**
 * Iterate through a reference in the database, returning the children ordered
 * by key in batches.
 *
 * @param {string} path The path to the reference to iterate through.
 * @param {number} batchSize The number of children to fetch in each batch.
 * @returns {AsyncGenerator<[string, import("firebase-admin/database").DataSnapshot]>}
 */
export async function* databaseIterator(path, batchSize = 1000) {
  let lastKey = null;
  while (true) {
    const snap = lastKey
      ? await getDatabase()
          .ref(path)
          .orderByKey()
          .startAfter(lastKey)
          .limitToFirst(batchSize)
          .get()
      : await getDatabase()
          .ref(path)
          .orderByKey()
          .limitToFirst(batchSize)
          .get();
    if (!snap.exists()) return;

    const childKeys = [];
    snap.forEach((child) => {
      childKeys.push(child.key);
      lastKey = child.key;
    });
    for (const key of childKeys) {
      yield [key, snap.child(key)];
    }
  }
}
