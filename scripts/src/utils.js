import { getDatabase } from "firebase-admin/database";

/**
 * Iterate through a reference in the database, returning the children ordered
 * by key in batches.
 *
 * @param {string} path The path to the reference to iterate through.
 * @param {number} batchSize The number of children to fetch in each batch.
 * @param {string} [start] The key to start at (inclusive).
 * @param {string} [end] The key to end at (inclusive).
 * @returns {AsyncGenerator<[string, import("firebase-admin/database").DataSnapshot]>}
 */
export async function* databaseIterator(
  path,
  batchSize = 1000,
  start, // inclusive
  end, // inclusive
) {
  let lastKey = undefined;
  while (true) {
    let query = getDatabase().ref(path).orderByKey();
    if (lastKey !== undefined) {
      query = query.startAfter(lastKey);
    } else if (start !== undefined) {
      query = query.startAt(start);
    }
    if (end !== undefined) {
      query = query.endAt(end);
    }

    const snap = await query.limitToFirst(batchSize).get();
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
