import { Router, Request, Response } from 'express';

const calcRouter = Router();

let numbers: number[] = []
calcRouter.get('/numbers/:numberId', async (req: Request, res: Response) => {
    const authPayload = {
        "companyName": "Shivam Jha",
        "clientID": "9b92075b-d8d5-4935-8980-eb31a69cc9f2",
        "clientSecret": "ERUYgzawNmBCborS",
        "ownerName": "Shivam Jha",
        "ownerEmail": "2105068@kiit.ac.in",
        "rollNo": "2105068"
    }
    try {
        let endpoint;
        switch (req.params.numberId) {
            case 'p':
                endpoint = 'prime';
                break;
            case 'f':
                endpoint = 'fibo';
                break;
            case 'e':
                endpoint = 'even';
                break;
            case 'r':
                endpoint = 'random';
                break;
            default:
                return res.status(400).json({ error: 'Invalid number ID' });
        }

        const response = await fetch(`http://20.244.56.144/test/${endpoint}`, {
            method: 'GET',
            headers: {
                "Authorization": `Bearer ${process.env.TOKEN}`
            }
        });
        const responseFromTestServer = await response.json();
        console.log(responseFromTestServer);
        const windowPrevState = [...numbers];
        numbers = [...numbers, ...responseFromTestServer.numbers].slice(-parseInt(process.env.WINDOW_SIZE ?? "10"));
        const json = {
            windowPrevState,
            windowCurrentState: numbers,
            numbers: responseFromTestServer.numbers,
        }
        res.status(200).json(json);
    } catch (e) {
        console.log(e);
        res.status(500).json({
            error: "Internal Server error"
        })
    }
})

export default calcRouter;