import prisma from '/helpers/prisma'
import permission from '../permission'


export default async function create_instance(req, res) {
    if (req.method != "POST") {
        res.status(405).send({message: 'Only POST requests allowed'})
    }
    const body = req.body;

    var Cookies = require('cookies')
    var cookies = new Cookies(req, res)
    const token = cookies.get('aToken')
    if (!token) {
      res.status(200).send({validEvent: false, loggedIn: false, message: "needs login"})
      return;
    }

    const response = await permission(req, res, token);

    if (response.decodedAccessToken.sub != body.np_sub) {
      res.status(200).send({created:false, message: "Does not have access"})
      return;
    }

    
    try {
      const instance = await prisma.DataSNS.create({
          data: {
            data: body.data,
            dateTime: body.dateTime,
            notes: body.notes,
            time: body.time,
            volunteerName: body.volunteerName,
            weather: body.weather,
            temperature: body.temperature,
            eventId: body.eventId,
            np_sub: body.np_sub,
        },
      })
      res.status(200).json({created: true, message: "Success!", newInstance: instance})
    } catch(e) {
      res.status(500).send({created: false, message: e.message})
    }

}