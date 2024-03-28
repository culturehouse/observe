export default async function home(req, res) {
  // checks if the request method is a POST
  if (req.method !== "POST") {
    res.status(405).send({ message: "Only POST requests allowed" });
    return;
  }

  res.setHeader("Set-Cookie", "aToken=; Path=/; HttpOnly; Max-Age=0");

  res.status(200).send({ message: "Logged out" });
}
