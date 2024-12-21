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
import { fileURLToPath } from "node:url";

// Patch for __dirname not being available in ES modules.
const __dirname = path.dirname(fileURLToPath(import.meta.url));

let build, emulators, app;

process.on("exit", () => {
  if (build && !build.killed) build.kill();
  if (emulators && !emulators.killed) emulators.kill();
  if (app && !app.killed) app.kill();
});

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

setInterval(async () => {
  await pubsub.topic("firebase-schedule-clearConnections").publishJSON({});
}, 60 * 1000); // every minute
