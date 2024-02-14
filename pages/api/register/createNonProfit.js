import prisma from '/helpers/prisma';

export default async function createNonProfit(req, res) {
    // checks if the request method is a GET
    if (req.method !== 'POST') {
        res.status(405).send({ message: 'Only POST requests allowed' });
        return;
    } 
    
    const body = req.body;

    try {
        // query the db through prisma, storing result in events variable
        const non_profit = await prisma.NonProfits.create({
                data: {
                    name: body.name,
                    username: body.username,
                    projects: [],
                    np_sub: body.np_sub,
                },
    
        });


        res.status(200).json({message: "Sucess", non_profit: non_profit});
    } catch (e) { // catch error if thrown during prisma query
        // send error message as error response (500 is the status code 
        // referring to an internal server error)
        res.status(500).send({ message: e.message });
    }

    
}