import auth0 from 'auth0-js';
import { AUTH0_CLIENT_ID, AUTH0_DOMAIN, AUTH0_USER_SCOPE } from "./config";

export const auth = new auth0.WebAuth({
    domain: AUTH0_DOMAIN,
    clientID: AUTH0_CLIENT_ID,
    scope: AUTH0_USER_SCOPE,
    audience: 'https://culture.house/',
});