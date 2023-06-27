import prisma from '/helpers/prisma';

export default async function viewEventHeatmaps(req, res) {
    // checks if the request method is a GET
    if (req.method !== 'GET') {
        res.status(405).send({ message: 'Only GET requests allowed' });
        return;
    }

    // ensure non-null event ID
    const event_id = req.query.event_id; // store id from query (URL) into local variable
    if (!event_id) {
        res.status(400).send({ message: 'Event ID must be provided' });
        return;
    }

    // try to execute code in try block, if error thrown, enter catch
    try {
        // query the db through prisma, storing result in events variable
        const heatmaps = await prisma.AggregateSNS.findMany({
            where: {
                eventId: event_id,
            }
        });

        // convert events into json and return as success response (200 is 
        // the success status code)
        res.status(200).json(heatmaps);
    } catch (e) { // catch error if thrown during prisma query
        // send error message as error response (500 is the status code 
        // referring to an internal server error)
        res.status(500).send({ message: e.message });
    }
}