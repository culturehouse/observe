import prisma from "/helpers/prisma";

export default async function accessEvent(req, res) {
  // checks if the request method is a GET
  if (req.method !== "GET") {
    res.status(405).send({ message: "Only GET requests allowed" });
    return;
  }

  let eCode = req.query.eCode;

  try {
    // query the db through prisma, storing result in events variable
    const events = await prisma.Events.findMany({
      where: {
        eCode: eCode,
      },
      take: 1,
    });

    if (events.length != 0) {
      // const router = useRouter();
      // router.push({
      //     pathname: '/second/[eCode]]',
      //     query: { eCode: eCode },
      // });

      res.setHeader(
        "Set-Cookie",
        `eCode=${eCode}; Path=/; HttpOnly; Secure; Max-Age=7200000`
      );

      res
        .status(200)
        .json({ valid: true, message: "Correct Code", eventId: events[0].id });
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
