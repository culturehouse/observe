import prisma from '/helpers/prisma';
import permission from '../../permission';

export default async function getInstances(req, res) {

    if (req.method !== 'DELETE') {
        res.status(405).send({ success: false, message: 'Only DELETE requests allowed' });
        return;
    }

    const instance_id = req.query.id;
    if (!instance_id) {
        res.status(400).send({ success: false, message: 'Instance ID must be provided' });
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
        const deleteInstance = await prisma.DataSNS.delete({
            where: {
                id: instance_id,
            },
        })

        res.status(200).json({success: true, delete: deleteInstance});
    } catch (e) {
        res.status(500).send({success: false, message: e.message });
    }
}
