import compress from "compression";
import helmet from "helmet";
import logger from "./logger";

import feathers from "@feathersjs/feathers";
import configuration from "@feathersjs/configuration";
import express from "@feathersjs/express";
import primus from "@feathersjs/primus";

import objection from "./objection";
import authentication from "./authentication";
import services from "./services";
import channels from "./channels";

const app = express(feathers());

// Load app configuration
app.configure(configuration());
// Enable security, compression, and body parsing
app.use(helmet());
app.use(compress());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Set up plugins and providers
app.configure(express.rest());
app.configure(primus({ transformer: "websockets" }));
app.configure(objection);
app.configure(authentication);
// Set up our services (see `services/index.js`)
app.configure(services);
// Set up event channels (see channels.js)
app.configure(channels);

// Configure a middleware for 404s and the error handler
app.use(express.notFound());
app.use(express.errorHandler({ logger }));

export default app;
