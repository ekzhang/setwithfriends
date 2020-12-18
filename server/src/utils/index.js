/** Core game logic, can have similar code to @client/src/utils/index.js */

import animals from "./animals.json";

const colors = [
  "red",
  "pink",
  "purple",
  "deepPurple",
  "indigo",
  "blue",
  "lightBlue",
  "cyan",
  "teal",
  "green",
  "lightGreen",
  "lime",
  "amber",
  "orange",
  "deepOrange",
];

export function generateName() {
  return "Anonymous " + animals[Math.floor(Math.random() * animals.length)];
}

export function generateColor() {
  return colors[Math.floor(Math.random() * colors.length)];
}
