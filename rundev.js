/**
 * @file Development script, which performs the following actions.
 *
 * 1. Runs `npm run build -- --watch` on the functions directory.
 * 2. Starts the Firebase Local Emulator Suite.
 * 3. Manually executes the `clearConnections` function on a schedule.
 * 4. Starts the frontend React app with Fast Refresh enabled.
 */
import { PubSub } from "@google-cloud/pubsub";
import { spawn, spawnSync } from "node:child_process";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

// Patch for __dirname not being available in ES modules.
const __dirname = path.dirname(fileURLToPath(import.meta.url));

console.log("[setwithfriends] Starting development script...");

let build, emulators, app;

// Initial build
spawnSync("npm", ["run", "build"], {
  cwd: path.join(__dirname, "functions"),
  stdio: ["ignore", "inherit", "inherit"],
});

// Incremental watch builds
build = spawn(
  "npm",
  ["run", "build", "--", "--watch", "--preserveWatchOutput"],
  {
    cwd: path.join(__dirname, "functions"),
    stdio: ["ignore", "inherit", "inherit"],
  },
);

// Start emulators
emulators = spawn(
  "firebase",
  [
    "emulators:start",
    "--project",
    "staging",
    "--import=./data",
    "--export-on-exit",
  ],
  {
    cwd: __dirname,
    stdio: ["ignore", "inherit", "inherit"],
  },
);

// Frontend application
app = spawn("npm", ["run", "dev"], {
  cwd: __dirname,
  stdio: ["ignore", "pipe", "inherit"],
  env: Object.assign({ FORCE_COLOR: true }, process.env),
});
app.stdout.pipe(process.stdout);

const pubsub = new PubSub({
  apiEndpoint: "localhost:8085",
  projectId: "setwithfriends-dev",
});

// This is a workaround for the Pub/Sub emulator not supporting scheduled functions.
// https://github.com/firebase/firebase-tools/issues/2034
const pubsubIntervals = [
  setInterval(async () => {
    await pubsub
      .topic("firebase-schedule-clearConnections")
      .publishMessage({ json: {} });
  }, 60 * 1000), // every minute

  setInterval(async () => {
    await pubsub
      .topic("firebase-schedule-archiveStaleGames")
      .publishMessage({ json: {} });
  }, 3600 * 1000), // every hour
];

let shutdownCalled = false;

async function shutdown() {
  if (shutdownCalled) return;
  shutdownCalled = true;

  for (const interval of pubsubIntervals) {
    clearInterval(interval);
  }

  const waitForChild = (p) => new Promise((resolve) => p.on("exit", resolve));
  await Promise.all([
    waitForChild(build),
    waitForChild(emulators),
    waitForChild(app),
  ]);
  console.log("[setwithfriends] Finished development script, goodbye!");
}

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
