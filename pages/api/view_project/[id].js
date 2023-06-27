import prisma from '/helpers/prisma';
import permission from '../permission';

export default async function viewProject(req, res) {

    if (req.method === 'GET') {
        const project_id = req.query.id;
        if (!project_id) {
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
            const projects = await prisma.Projects.findMany({
                where: {
                    id: project_id,
                },
                take: 1,
            });

            if (projects.length == 0) {
                res.status(200).send({loggedIn: true, access: false, message: "No project with ID"})
                return;
            }
            if (projects[0].np_sub != response.decodedAccessToken.sub) {
                res.status(200).send({loggedIn: true, access: false, message: "Does not have access"})
                return;
            }

            res.status(200).json({ access: true, loggedIn: true, projects: projects });
        } catch (e) {
            res.status(500).send({ access: false, loggedIn: true, message: e.message });
        }
    } else if (req.method === 'PUT') {
        const project_id = req.query.id;
        const body = req.body;
        if (!project_id) {
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
            const projects = await prisma.Projects.update({
                where: {
                    id: project_id,
                },
                data: {
                    current: body.current,
                }
            });

            res.status(200).send({ loggedIn: true, access: true, message: "Updated current status successfully"});
        } catch (e) {
            res.status(500).send({ loggedIn: true, access: false, message: e.message });
        }
    } else {
        res.status(405).send({ message: 'Only GET and PUT requests allowed' });
        return;
    }
}