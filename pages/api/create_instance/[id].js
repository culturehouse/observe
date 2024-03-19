import prisma from "/helpers/prisma";
import permission from "../permission";

export default async function create_event(req, res, next) {
  if (req.method != "GET") {
    res.status(405).send({ message: "Only GET requests allowed" });
  }

  const id = req.query.id;

  const token = req.cookies.aToken;

  if (!token) {
    res
      .status(200)
      .send({ validEvent: false, loggedIn: false, message: "needs login" });
    return;
  }
  // res.status(200).send({dataFetched: false, message: "i'm hereee"})
  const response = await permission(req, res, token);

  try {
    const events = await prisma.Events.findMany({
      where: {
        id: id,
      },
    });
    if (events.length == 0) {
      res.status(200).send({
        validEvent: false,
        loggedIn: true,
        message: "No event with provided id",
      });
    } else {
      if (events[0].np_sub == response.decodedAccessToken.sub) {
        res.status(200).send({ validEvent: true, event: events[0] });
      } else {
        res.status(200).send({
          validEvent: false,
          loggedIn: true,
          message: "Current user doesn't have access to the specified event",
        });
      }
    }
  } catch (e) {
    res
      .status(500)
      .send({ validEvent: false, loggedIn: true, message: e.message });
  }

  // res.status(200).send({message: "WEEEEEE"})
}
