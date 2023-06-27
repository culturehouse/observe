import prisma from '/helpers/prisma';

export default async function viewInstance(req, res) {
    // checks if the request method is a GET
    if (req.method !== 'GET') {
        res.status(405).send({ message: 'Only GET requests allowed' });
        return;
    }

    // ensure non-null event ID
    const instance_id = req.query.id; // store id from query (URL) into local variable
    if (!instance_id) {
        res.status(400).send({ message: 'Instance ID must be provided' });
        return;
    }

    // try to execute code in try block, if error thrown, enter catch
    try {
        // query the db through prisma, storing result in events variable
        const instance = await prisma.DataSNS.findMany({
            where: {
                id: instance_id,
            },
            take: 1,
        });

        // convert events into json and return as success response (200 is 
        // the success status code)
        res.status(200).json(instance);
    } catch (e) { // catch error if thrown during prisma query
        // send error message as error response (500 is the status code 
        // referring to an internal server error)
        res.status(500).send({ message: e.message });
    }
}