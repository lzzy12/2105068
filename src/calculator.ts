import { Router, Request, Response } from 'express';

const calcRouter = Router();

let numbers: number[] = []
calcRouter.get('/numbers/:numberId', async (req: Request, res: Response) => {
    try {
        let responseFromTestServer: { numbers: [] };
        switch (req.params.numberId) {
            case 'p':
                {
                    const response = await fetch('http://20.244.56.144/test/prime', {
                        method: 'GET',
                    });
                    responseFromTestServer = await response.json();
                    break;
                }
            case 'f':
                {
                    const response = await fetch('http://20.244.56.144/test/fibo', {
                        method: 'GET',
                    });
                    responseFromTestServer = await response.json();
                    break;
                } case 'e':
                {
                    const response = await fetch('http://20.244.56.144/test/even', {
                        method: 'GET',
                    });
                    responseFromTestServer = await response.json();
                    break;
                }
            case 'r':
                {
                    const response = await fetch('http://20.244.56.144/test/random', {
                        method: 'GET',
                    });
                    responseFromTestServer = await response.json();
                    break;
                }
            default:
                res.status(400).json({
                    error: "invalid number id",
                })
                return;
        }
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