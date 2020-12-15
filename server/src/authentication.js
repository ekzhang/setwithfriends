import { AuthenticationService } from "@feathersjs/authentication";
import { OAuthStrategy, expressOauth } from "@feathersjs/authentication-oauth";
import { NotAuthenticated } from "@feathersjs/errors";

import firebase from "firebase-admin";
import jwt from "jsonwebtoken";

import logger from "./logger";

function initializeFirebase(app) {
  try {
    const firebaseConfig = JSON.parse(app.get("firebase"));
    firebase.initializeApp({
      credential: firebase.credential.cert(firebaseConfig),
    });
  } catch (error) {
    logger.error("error initializing firebase", error);
  }
}

class FirebaseStrategy extends OAuthStrategy {
  async authenticate(authentication, params) {
    logger.debug("firebase:strategy:authenticate");
    return super.authenticate(authentication, params);
  }

  async getProfile(data) {
    try {
      let user;
      if (process.env.NODE_ENV === "production") {
        user = await firebase.auth().verifyIdToken(data.access_token);
      } else {
        user = jwt.decode(data.access_token);
      }
      logger.debug(`firebase:strategy:getProfile:successful ${user.user_id}`);
      return {
        email: user.email,
        id: user.user_id,
      };
    } catch (e) {
      logger.debug(`firebase:strategy:getProfile:error ${e}`);
      throw new NotAuthenticated();
    }
  }

  async getEntityData(profile) {
    const baseData = await super.getEntityData(profile);
    return {
      ...baseData,
      email: profile.email,
    };
  }
}

function authentication(app) {
  if (process.env.NODE_ENV === "production") {
    // We use Firebase Auth in both development and production, but since we
    // need a service account secret to actually verify the access tokens, in
    // development we do not verify the authentication tokens and just decode
    // them directly using the `jsonwebtoken` package.
    //
    // This gives us both openness and ease of development (no need to share
    // service account secrets) and security in production. It also allows us
    // to keep using Firebase Auth on the client side.
    initializeFirebase(app);
  }

  const authentication = new AuthenticationService(app);
  authentication.register("firebase", new FirebaseStrategy());

  app.use("/authentication", authentication);
  app.configure(expressOauth());
}

export default authentication;
