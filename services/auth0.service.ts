import auth0 from "auth0-js";

export const auth = new auth0.WebAuth({
  domain: `${process.env.NEXT_PUBLIC_AUTH0_DOMAIN}`,
  clientID: `${process.env.NEXT_PUBLIC_AUTH0_CLIENT_ID}`,
  scope: `${process.env.NEXT_PUBLIC_AUTH0_USER_SCOPE}`,
  audience: "https://culture.house/",
});
