import prisma from "/helpers/prisma";

export default async function viewEvent(req, res) {
  // res.status(405).send({ message: req.method });
  // checks if the request method is a GET
  if (req.method !== "PUT") {
    res.status(405).send({ message: "Only PUT requests allowed" });
    return;
  }

  const id = req.query.id; // store id from query (URL) into local variable
  if (!id) {
    res.status(400).send({ message: "Event ID must be provided" });
    return;
  }

  // try to execute code in try block, if error thrown, enter catch
  try {
    const body = req.body;
    const { description, name, imageUploaded } = body;
    const projects = await prisma.Projects.update({
      where: {
        id: id,
      },
      data: {
        ...(description !== undefined && { description }),
        ...(name !== undefined && { name }),
        ...(imageUploaded !== undefined && { imageUploaded }),
      },
    });

    res.status(200).json(projects);
  } catch (e) {
    res.status(500).send({ message: e.message });
  }
}
