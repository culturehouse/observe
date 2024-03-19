import prisma from "/helpers/prisma";
import permission from "../permission";

export default async function createProject(req, res) {
  // checks if the request method is a GET
  if (req.method !== "POST") {
    res.status(405).send({ message: "Only POST requests allowed" });
    return;
  }

  const body = req.body;

  const token = req.cookies.aToken;

  if (!token) {
    res.status(200).send({ message: "needs login" });
    return;
  }
  const response = await permission(req, res, token);

  if (response.decodedAccessToken.sub != body.np_sub) {
    res.status(200).send({ message: "Does not have access" });
    return;
  }

  try {
    // query the db through prisma, storing result in events variable
    const new_project = await prisma.Projects.create({
      data: {
        current: body.current,
        description: body.description,
        events: body.events,
        headerImage: body.headerImage,
        name: body.name,
        npId: body.npId,
        np_sub: body.np_sub,
      },
    });

    res.status(200).json({ message: "Sucess", new_project: new_project });
  } catch (e) {
    // catch error if thrown during prisma query
    // send error message as error response (500 is the status code
    // referring to an internal server error)
    res.status(500).send({ message: e.message });
  }
}
