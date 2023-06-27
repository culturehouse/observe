import prisma from '/helpers/prisma';

export default async function viewProjectEvents(req, res) {

    if (req.method !== 'GET') {
        res.status(405).send({ message: 'Only GET requests allowed' });
        return;
    }

    const np_id = req.query.np_id;
    if (!np_id) {
        res.status(400).send({ message: 'Nonprofit ID must be provided' });
        return;
    }

    try {
        const events = await prisma.Events.findMany({
            where: {
                npId: np_id,
            }
        });

        res.status(200).json(events);
    } catch (e) {
        res.status(500).send({ message: e.message });
    }
}