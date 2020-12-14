const app = require("../../src/app");

describe("'users' service", () => {
  it("registered the service", () => {
    const service = app.service("users");
    expect(service).toBeTruthy();
  });
});
