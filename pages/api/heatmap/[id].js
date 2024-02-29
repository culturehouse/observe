import prisma from "/helpers/prisma";
import permission from "../permission";

export default async function heatmap(req, res) {
  if (req.method == "GET") {
    var Cookies = require("cookies");
    var cookies = new Cookies(req, res);
    const token = cookies.get("aToken");
    if (!token) {
      res
        .status(200)
        .send({ validEvent: false, loggedIn: false, message: "needs login" });
      return;
    }

    const response = await permission(req, res, token);

    try {
      const queryResult = await prisma.AggregateSNS.findMany({
        where: {
          id: req.query.id,
        },
        take: 1,
      });

      if (queryResult.length == 0) {
        res.status(200).send({
          loggedIn: true,
          access: false,
          message: "No heatmap with ID",
        });
        return;
      }

      if (queryResult[0].np_sub != response.decodedAccessToken.sub) {
        res.status(200).send({
          loggedIn: true,
          access: false,
          message: "Does not have access",
        });
        return;
      }

      res.status(200).json({
        loggedIn: true,
        access: true,
        message: "got it!",
        aggregateSNS: queryResult[0],
      });
    } catch (e) {
      res
        .status(500)
        .send({ loggedIn: true, access: false, message: e.message });
    }
  }

  if (req.method == "PUT") {
    //res.status(205).json({message:"tester"})
    try {
      const data = await prisma.AggregateSNS.update({
        where: {
          id: req.query.id,
        },
        data: {
          notes: req.body.notes,
          data: req.body.data,
          instances: req.body.instances,
          filterQuery: req.body.filterQuery,
          num_instances: req.body.num_instances,
          dateModified: req.body.dateModified,
        },
      });

      res.status(200).json({
        message: "got it!",
        data: data,
      });
    } catch (e) {
      res.status(500).send({ message: e.message });
    }
  }
}
