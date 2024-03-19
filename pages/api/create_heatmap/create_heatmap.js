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
    res
      .status(200)
      .send({ created: false, loggedIn: false, message: "needs login" });
    return;
  }
  const response = await permission(req, res, token);

  if (response.decodedAccessToken.sub != body.np_sub) {
    res.status(200).send({
      created: false,
      loggedIn: true,
      access: false,
      message: "Does not have access",
    });
    return;
  }

  try {
    // query the db through prisma, storing result in events variable
    const new_heatmap = await prisma.AggregateSNS.create({
      data: {
        data: body.data,
        instances: body.instances,
        filterQuery: body.filterQuery,
        name: body.name,
        np_sub: body.np_sub,
        eventId: body.eventId,
        num_instances: body.num_instances,
        notes: body.notes,
        dateCreated: body.dateCreated,
        dateModified: body.dateModified,
        imageUploaded: false,
      },
    });

    res.status(200).json({
      access: true,
      loggedIn: true,
      created: true,
      new_heatmap: new_heatmap,
    });
  } catch (e) {
    // catch error if thrown during prisma query
    // send error message as error response (500 is the status code
    // referring to an internal server error)
    res.status(500).send({
      access: false,
      loggedIn: true,
      created: false,
      message: e.message,
    });
  }
}
