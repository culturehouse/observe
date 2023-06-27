import EventCode from '../../../lib/eventCode';
import prisma from '/helpers/prisma'

export default async function create_event(req, res, next) {
    if (req.method != "GET") {
        res.status(405).send({message: 'Only GET requests allowed'})
    }
    let eCode = req.query.eCode;
    let valid = false; 
    let dupEvent;
    while (!valid) {
        try {
            dupEvent = await prisma.Events.findMany({
                where: {
                    eCode: eCode,
                }
            })
            if (dupEvent.length == 0) {
                valid = true
                res.status(200).send({eCode: eCode})
            } else {
               eCode = EventCode(eCode.slice(0, 2).toUpperCase())
            }
        } catch(e) {
            res.status(500).send({message: e.message})
        }
    }

    // res.status(200).send({message: "WEEEEEE"})
  


}