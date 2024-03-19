import prisma from "/helpers/prisma";

export default async function accessEvent(req, res) {
  // checks if the request method is a GET
  if (req.method !== "GET") {
    res.status(405).send({ message: "Only GET requests allowed" });
    return;
  }

  let eventId = req.query.eventId;

  const eCode = req.cookies.eCode;

  if (!eCode) {
    res.status(500).send({
      valid: false,
      message: "You can't log data without entering an event code",
    });
  }

  try {
    // query the db through prisma, storing result in events variable
    const event = await prisma.Events.findMany({
      where: {
        eCode: eCode,
      },
      take: 1,
    });

    if (event.length != 0) {
      if (event[0].id == eventId) {
        res
          .status(200)
          .json({ valid: true, message: "Correct Code", event: event[0] });
      } else {
        res.status(200).json({
          valid: false,
          message:
            "You don't have access to this event, please enter the correct event code",
        });
      }
    } else {
      res.status(200).json({ valid: false, message: "Incorrect Code" });
    }
  } catch (e) {
    // catch error if thrown during prisma query
    // send error message as error response (500 is the status code
    // referring to an internal server error)
    res.status(500).send({ message: e.message });
  }
}
