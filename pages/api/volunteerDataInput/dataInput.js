import prisma from '/helpers/prisma';


export default async function logVolunteerData(req, res) {
    // checks if the request method is a GET
    if (req.method !== 'POST') {
        res.status(405).send({ message: 'Only POST requests allowed' });
        return;
    } 
    
    const body = req.body;

    try {
        const dataPoint = await prisma.DataSNS.create({
            data: {
                data: body.data,
                dateTime: body.dateTime,
                notes: body.notes,
                time: body.time,
                volunteerName: body.volunteerName,
                weather: body.weather,
                temperature: Number(body.temperature),
                np_sub: body.np_sub,
                eventId: body.eventId
            },
        })

        // res.status(200).json({message: "Sucess", data: body});

        res.status(200).json({message: "Sucess", data: dataPoint, valid: true});
    } catch (e) { // catch error if thrown during prisma query
        // send error message as error response (500 is the status code 
        // referring to an internal server error)
        res.status(500).send({ message: e.message, valid: false });
    }

    
}