import prisma from "/helpers/prisma";
import permission from "../permission";

export default async function home(req, res) {
  // checks if the request method is a GET
  if (req.method !== "GET") {
    res.status(405).send({ message: "Only GET requests allowed" });
    return;
  }

  const accessToken = req.query.accessToken;
  var Cookies = require("cookies");

  var cookies = new Cookies(req, res);

  cookies.set("aToken", null, { overwrite: true });
  res.status(200).send({ message: "Logged out" });
}
