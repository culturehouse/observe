import prisma from '/helpers/prisma';

export default async function viewProjectEvents(req, res) {

    if (req.method !== 'GET') {
        res.status(405).send({ message: 'Only GET requests allowed' });
        return;
    }

    const project_id = req.query.id;
    if (!project_id) {
        res.status(400).send({ message: 'Event ID must be provided' });
        return;
    }

    try {
        const events = await prisma.Events.findMany({
            where: {
                projectId: project_id,
            }
        });

        res.status(200).json(events);
    } catch (e) {
        res.status(500).send({ message: e.message });
    }
}