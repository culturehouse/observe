import prisma from '/helpers/prisma';
import permission from '../permission';

export default async function getInstances(req, res) {

    if (req.method !== 'GET') {
        res.status(405).send({ message: 'Only GET requests allowed' });
        return;
    }

    const event_id = req.query.event_id;
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


    try {
        const instances = await prisma.dataSNS.findMany({
            where: {
                eventId: event_id,
            }
        });
            if (instances.length != 0) {
                if (instances[0].np_sub != response.decodedAccessToken.sub) {
                    res.status(200).send({loggedIn: true, access: false, message: "Does not have access"})
                    return;
                }
            }

        res.status(200).json({loggedIn: true, access: true, instances: instances});
    } catch (e) {
        res.status(500).send({ loggedIn: true, access: false, message: e.message });
    }
}
