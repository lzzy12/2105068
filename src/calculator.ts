import { Router, Request, Response } from 'express';

const calcRouter = Router();

let numbers: number[] = []

let accessToken: string | null = null;
let accessTokenExpiry: number | null = null;
calcRouter.get('/numbers/:numberId', async (req: Request, res: Response) => {
    if (!(accessToken && accessTokenExpiry && accessTokenExpiry > Date.now())) {
        const authPayload = {
            "companyName": process.env.company,
            "clientID": process.env.clientId,
            "clientSecret": process.env.clientSecret,
            "ownerName": process.env.ownerName,
            "ownerEmail": process.env.ownerEmail,
            "rollNo": process.env.rollNo
        }
        const authFetch = await fetch('http://20.244.56.144/test/auth', {
            method: 'POST',
            body: JSON.stringify(authPayload),
        })
        const authRes = await authFetch.json();
        accessToken = authRes.access_token;
        accessTokenExpiry = authRes.expires_in * 1000;

    }
    
    try {
        let endpoint;
        switch (req.params.numberId) {
            case 'p':
                endpoint = 'primes';
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
                "Authorization": `Bearer ${accessToken}`
            }
        });
        const responseFromTestServer = await response.json();
        console.log(responseFromTestServer);
        const windowPrevState = [...numbers];
        numbers = [...numbers, ...responseFromTestServer.numbers].slice(-parseInt(process.env.WINDOW_SIZE ?? "10"));
        let sum = 0;
        numbers.forEach(( num) => {sum += num})
        const json = {
            windowPrevState,
            windowCurrentState: numbers,
            numbers: responseFromTestServer.numbers,
            avg: sum / numbers.length
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