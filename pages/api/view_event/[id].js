import prisma from '/helpers/prisma';
import permission from '../permission';

export default async function viewEvent(req, res) {
    // checks if the request method is a GET
    if (req.method !== 'GET') {
        res.status(405).send({ message: 'Only GET requests allowed' });
        return;
    }

    // ensure non-null event ID
    const event_id = req.query.id; // store id from query (URL) into local variable
    if (!event_id) {
        res.status(400).send({ message: 'Event ID must be provided' });
        return;
    }

    var Cookies = require('cookies')

    var cookies = new Cookies(req, res)
    const token = cookies.get('aToken')
    if (!token) {
        res.status(200).send({access: false, loggedIn: false, message: "needs login"})
        return;
    }

    const response = await permission(req, res, token);

    // try to execute code in try block, if error thrown, enter catch
    try {
        // query the db through prisma, storing result in events variable
        const events = await prisma.Events.findMany({
            where: {
                id: event_id,
            },
            take: 1,
        });

        if (events.length == 0) {
            res.status(200).send({loggedIn: true, access: false, message: "No event with ID"})
            return;
        }

        if (events[0].np_sub != response.decodedAccessToken.sub) {
            res.status(200).send({loggedIn: true, access: false, message: "Does not have access"})
            return;
        }
        // convert events into json and return as success response (200 is 
        // the success status code)
        res.status(200).json({access: true, loggedIn: true, events: events});
    } catch (e) { // catch error if thrown during prisma query
        // send error message as error response (500 is the status code 
        // referring to an internal server error)
        res.status(500).send({ access: false, loggedIn: true, message: e.message });
    }
}