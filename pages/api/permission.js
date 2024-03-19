import jwksClient from "jwks-rsa";
import jwt from "jsonwebtoken";

export const exposableErrors = [
  jwt.TokenExpiredError,
  jwt.JsonWebTokenError,
  jwt.NotBeforeError,
];

async function getPublicKey(header) {
  const client = jwksClient({
    jwksUri: `https://${process.env.AUTH0_DOMAIN}/.well-known/jwks.json`,
  });
  console.log(header);
  const signingKey = await client.getSigningKey(header.kid);
  let publicKey = signingKey.getPublicKey();

  return publicKey;
}

const jwtVerify = (token, secretOrPublicKey, header, options) =>
  new Promise((resolve, reject) => {
    const getKey = (header, callback) =>
      secretOrPublicKey(header)
        .then((key) => callback(null, key))
        .catch((err) => callback(err));

    jwt.verify(token, getKey, options, (err, decoded) => {
      if (err) {
        reject(err);
      } else {
        resolve(decoded);
      }
    });
  });

export default async function permission(req, res, token) {
  // checks if the request method is a GET

  if (!token) {
    return { message: "No permission" };
  }

  let header = JSON.parse(new Buffer(token.split(".")[0], "base64"));
  // res.status(201).send({message: header})
  const decodedAccessToken = await jwtVerify(token, getPublicKey, header, {
    algorithms: ["RS256"],
    issuer: `https://${process.env.AUTH0_DOMAIN}/`,
  });

  return { message: "We got permission!", decodedAccessToken };
}
