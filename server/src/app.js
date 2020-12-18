import feathers from "@feathersjs/feathers";
import configuration from "@feathersjs/configuration";
import primus from "@feathersjs/primus";

import objection from "./objection";
import authentication from "./authentication";
import services from "./services";
import channels from "./channels";
import hooks from "./hooks";

const app = feathers();

// Load app configuration
app.configure(configuration());

// Set up plugins and providers
app.configure(primus({ transformer: "websockets" }));
app.configure(objection);
app.configure(authentication);
// Set up our services (see `services/index.js`)
app.configure(services);
// Set up event channels (see channels.js)
app.configure(channels);

// Configure app-level hooks
app.hooks(hooks);

export default app;
