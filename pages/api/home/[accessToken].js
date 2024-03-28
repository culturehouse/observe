import prisma from "/helpers/prisma";
import permission from "../permission";

export default async function home(req, res) {
  // checks if the request method is a GET
  if (req.method !== "GET") {
    res.status(405).send({ message: "Only GET requests allowed" });
    return;
  }

  const accessToken = req.query.accessToken;
  let response = await permission(req, res, accessToken);

  res.setHeader(
    "Set-Cookie",
    `aToken=${accessToken}; Path=/; HttpOnly; Max-Age=86400`
  );

  try {
    // query the db through prisma, storing result in events variable
    const non_profit = await prisma.NonProfits.findMany({
      where: {
        np_sub: response.decodedAccessToken.sub,
      },
      take: 1,
    });

    if (non_profit.length == 0) {
      res
        .status(200)
        .send({ dataFetched: false, loggedIn: true, message: "no non-profit" });
      return;
    }

    const projects = await prisma.Projects.findMany({
      where: {
        npId: non_profit[0].id,
      },
    });
    // convert events into json and return as success response (200 is
    // the success status code)
    res.status(200).json({
      dataFetched: true,
      loggedIn: true,
      message: response.message,
      non_profit: non_profit,
      projects: projects,
      crumbs: { np: { name: non_profit[0].name, id: non_profit[0].id } },
    });
  } catch (e) {
    // catch error if thrown during prisma query
    // send error message as error response (500 is the status code
    // referring to an internal server error)
    res
      .status(500)
      .send({ dataFetched: false, loggedIn: true, message: e.message });
  }
}
