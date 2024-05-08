import express, { Application, Request, Response, NextFunction } from 'express';
import morgan from 'morgan';
import bodyParser from 'body-parser';

const app: Application = express();
const port = 3000;

// Middleware
app.use(morgan('dev')); // Morgan for logging
app.use(bodyParser.urlencoded({ extended: false })); // Parse URL-encoded bodies
app.use(bodyParser.json()); // Parse JSON bodies

// Routes
app.get('/', (req: Request, res: Response) => {
  res.send('Hello, World!');
});

// Error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).send('Something went wrong!');
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});