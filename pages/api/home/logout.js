export default async function home(req, res) {
  // checks if the request method is a GET
  if (req.method !== "GET") {
    res.status(405).send({ message: "Only GET requests allowed" });
    return;
  }

  res.setHeader(
    "Set-Cookie",
    `aToken=; Path=/; HttpOnly; Expires=${new Date().toUTCString()}`
  );

  res.status(200).send({ message: "Logged out" });
}
