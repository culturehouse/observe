import prisma from "/helpers/prisma";
import permission from "../permission";

export default async function create_event(req, res) {
  if (req.method != "GET") {
    res.status(405).send({ message: "Only GET requests allowed" });
  }
  let id = req.query.id;
  if (!id) {
    res.status(400).send({ validEvent: false, message: "No given event id" });
  }

  const token = req.cookies.aToken;

  if (!token) {
    res.status(200).send({
      validEvent: false,
      loggedIn: false,
      access: false,
      message: "needs login",
    });
    return;
  }
  // res.status(200).send({dataFetched: false, message: "i'm hereee"})
  const response = await permission(req, res, token);

  try {
    const instances = await prisma.DataSNS.findMany({
      where: {
        eventId: id,
      },
    });
    if (instances.length == 0) {
      res.status(200).send({ validEvent: true, loggedIn: true, data: [] });
    } else {
      if (instances[0].np_sub == response.decodedAccessToken.sub) {
        res.status(200).send({
          validEvent: true,
          loggedIn: true,
          access: true,
          data: instances,
        });
      } else {
        res.status(200).send({
          validEvent: false,
          loggedIn: true,
          access: false,
          message:
            "Current user doesn't have access to the specified event instances",
        });
      }
    }
  } catch (e) {
    res
      .status(500)
      .send({ validEvent: false, loggedIn: true, message: e.message });
  }
}
