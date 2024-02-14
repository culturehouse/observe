
// const prisma = require("./client");
// const express = require("express");

// const app = express();
// app.use(express.json());

// var cors = require("cors");
// app.use(cors());

// const port = 3001;
// var ObjectId = require("bson").ObjectId;

// // Caleb: In the future, we should modularize this with sub-domains
// //        https://expressjs.com/en/guide/routing.html

// app.get("/", (req, res) => {
//   res.send("Hello!");
// });

// app.get('/instances', (req, res, next) => {
//   prisma.dataSNS.findMany()
//     .then((instances) => {
//       console.log(instances);
//       res.send(instances);
//     })
//     .catch((exception) => next(exception));
// })

// app.post("/input", (req, res, next) => {
//   const body = req.body;
//   var id = new ObjectId();
//   prisma.dataSNS
//     .create({
//       data: {
//         id: id.toString(),
//         data: body.data,
//         dateTime: body.dateTime,
//         notes: body.notes,
//         time: body.time,
//         volunteerName: body.volunteerName,
//         weather: body.weather,
//         temperature: Number(body.temperature)
//       },
//     })
//     .then((newEntry) => res.send(newEntry))
//     .catch((exception) => next(exception)); // TODO: make error less sensitive
// });

// app.post("/create_event", (req, res, next) => {
//   const body = req.body;  
//   prisma.Events.create({
//     data: {
//       title: body.title,
//       date: body.date,
//       location: body.location,
//       notes: body.notes,
//       time: "",
//       eCode: body.eCode, 
//       projectId: body.id, 
//     },
//   })
//     .then((newEntry) => res.status(201).send(newEntry))
//     .catch((exception) => next(exception)); // TODO: make error less sensitive
// });

// // now unused, kept for reference
// app.get("/view_event/:id", (req, res, next) => {
//   const event_id = req.params.id;
//   prisma.Events.findMany({
//     where: {
//       id: event_id,
//     },
//     take: 1,
//   }).then((e) => res.send(e));
// });

// app.post("/login", (req, res, next) => {
//   const body = req.body;
//   console.log('body.username')
// });

// app.listen(port, () => {
//   console.log(`Example app listening on port ${port}`);
// });

// app.post("/create_project", (req, res, next) => {
//   const body = req.body;
//   prisma.Projects.create({
//     data: {
//       current: true, 
//       description: body.description,
//       events:[],
//       headerImage: "",
//       name: body.name,
//       nonprofitsId: body.npId,
//     },
//   })
//     .then((newEntry) => res.send(newEntry))
//     .catch((exception) => next(exception));
// });

// // move to ~/pages/api/view_project/[id]
// app.get("/view_project/:id", (req, res, next) => {
//   const project_id = req.params.id;
//   prisma.Projects.findMany({
//     where: {
//       id: project_id,
//     },
//     take: 1,
//   }).then((e) => res.send(e));
// });


// app.put("/view_project/:id", (req, res, next) => {
//   const project_id = req.params.id;
//   const body = req.body;
//   prisma.Projects.update({
//     where: {
//      id: project_id, 
//     },
//     data: {
//       current: body.current,
//     }
//   }).then((e) => res.send(e));
// });

// // move to ~/pages/api/view_project_events/[id]
// app.get("/view_project_events/:id", (req, res, next) => {
//   const project_id = req.params.id;
//   console.log(project_id);
//   prisma.Events.findMany({
//     where: {
//       projectId: project_id,
//     },
//   }).then((e) => res.send(e)
//   );
// });

// app.post("/create_aggregate", (req, res, next) => {
//   prisma.aggregateSNS.create(req.body)
//     .then((newEntry) => res.send(newEntry))
//     .catch((exception) => next(exception));
// })


// app.put("/edit_project/:id", (req, res, next) => {
//   const project_id = req.params.id;
//   const body = req.body;
//   prisma.Projects.update({
//     where: {
//      id: project_id, 
//     },
//     data: {
//       description: body.description,
//       name: body.name,
//       //headerImage: 
//     }
//   }).then((e) => res.send(e));
// });

