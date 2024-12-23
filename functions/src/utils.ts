import { type DataSnapshot, getDatabase } from "firebase-admin/database";
import * as zlib from "node:zlib";

/** Promises API wrapper around the 'zlib' Node library. */
export const gzip = {
  compress(
    input: string | Buffer | ArrayBuffer | Uint8Array | DataView,
  ): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      zlib.gzip(input, (err, result) => {
        if (err) reject(err);
        else resolve(result);
      });
    });
  },
  decompress(input: Buffer): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      zlib.gunzip(input, (err, result) => {
        if (err) reject(err);
        else resolve(result);
      });
    });
  },
};

/**
 * Iterate through a reference in the database, returning the children ordered
 * by key in batches.
 */
export async function* databaseIterator(
  path: string,
  batchSize = 1000,
): AsyncGenerator<[string, DataSnapshot]> {
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

    const childKeys: string[] = [];
    snap.forEach((child) => {
      childKeys.push(child.key);
      lastKey = child.key;
    });
    for (const key of childKeys) {
      yield [key, snap.child(key)];
    }
  }
}
