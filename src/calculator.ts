import { Router, Request, Response } from 'express';

const calcRouter = Router();

let numbers: number[] = []
calcRouter.get('/numbers/:numberId', async (req: Request, res: Response) => {
    const authPayload = {
        "companyName": "Shivam Jha",
        "clientID": "2a0e9485-7db8-419b-8c00-4c339b2fc2f2",
        "clientSecret": "mjOCoZipxwRkZwaJ",
        "ownerName": "Shivam Jha",
        "ownerEmail": "2105068.2@kiit.ac.in",
        "rollNo": "2105068"
    }
    const authFetch = await fetch('http://20.244.56.144/test/auth', {
        method: 'POST',
        body: JSON.stringify(authPayload),
    })
    const authRes = await authFetch.json();
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
                "Authorization": `Bearer ${authRes.access_token}`
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