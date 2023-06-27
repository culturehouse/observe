import prisma from "/helpers/prisma";

export default async function heatmap(req, res) {

    if (req.method == "PUT") {

    //res.status(205).json({message:"tester"})
        try {
            const data = await prisma.AggregateSNS.update({
                where: {
                id: req.query.id,
                },
                data: {
                    notes: req.body.notes,
                    dateModified: req.body.dateModified,
                },
            })

            res.status(200).json({
                success: true
            })
        } catch (e) {
            res.status(500).send({ success: false, message: e.message });
        }
    }

}
