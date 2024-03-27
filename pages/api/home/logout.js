export default async function home(req, res) {
  // checks if the request method is a POST
  if (req.method !== "POST") {
    res.status(405).send({ message: "Only POST requests allowed" });
    return;
  }

  res.setHeader(
    "Set-Cookie",
    `aToken=deleted; Path=/; HttpOnly; Secure; Max-Age=0; Expires=${new Date().toUTCString()}`
  );

  res.status(200).send({ message: "Logged out" });
}
