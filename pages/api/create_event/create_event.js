import EventCode from '../../../lib/eventCode';
import prisma from '/helpers/prisma'
import permission from '../permission';

export default async function create_event(req, res, next) {
    if (req.method != "POST") {
        res.status(405).send({message: 'Only POST requests allowed'})
    }
    const body = req.body;

    var Cookies = require('cookies')
    var cookies = new Cookies(req, res)
    const token = cookies.get('aToken')

    if (!token) {
      res.status(200).send({created: false, loggedIn: false, access: false, message: "needs login"})
      return;
    }
    const response = await permission(req, res, token);

    if (response.decodedAccessToken.sub != body.np_sub) {
      res.status(200).send({created:false, loggedIn: true, access: false, message: "Does not have access"})
      return;
    }
    
    try {
      const newEvent = await prisma.Events.create({
          data: {
            title: body.title,
            date: body.date,
            location: body.location,
            notes: body.notes,
            time: "",
            eCode: body.eCode, 
            projectId: body.id, 
            npId: body.npId,
            np_sub: body.np_sub,
            imageUploaded: body.imageUploaded,
          },
      })
      res.status(200).json({loggedIn: true, access: true, message: "Success!", newEvent: newEvent})
    } catch(e) {
      res.status(500).send({loggedIn: true, access: false, message: e.message})
    }

}