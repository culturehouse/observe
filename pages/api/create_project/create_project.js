import prisma from '/helpers/prisma'
import permission from '../permission'

export default async function create_event(req, res, next) {
  if (req.method != "POST") {
      res.status(405).send({message: 'Only POST requests allowed'})
  }
  const body = req.body;
  console.log(body);

  var Cookies = require('cookies')
  var cookies = new Cookies(req, res)
  const token = cookies.get('aToken')
  if (!token) {
    res.status(200).send({created: false, validProject: false, loggedIn: false, message: "needs login"})
    return;
  }

  const response = await permission(req, res, token);

  if (response.decodedAccessToken.sub != body.np_sub) {
    res.status(200).send({created:false, loggedIn:true, access: false, message: "Does not have access"})
    return;
  }

  try {
    const newProject = await prisma.Projects.create({
        data: {
          name: body.name,
          current: true,
          description: body.description,
          npId: body.npId,
          np_sub: body.np_sub,
          headerImage: "",
          events: [],
          imageUploaded: body.imageUploaded,
        },
    })
    res.status(200).json({loggedIn: true, canAccess:true, message: "Success!", newProject: newProject})
  } catch(e) {
    res.status(500).send({message: e.message})
  }

}