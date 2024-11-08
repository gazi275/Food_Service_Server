import cors from 'cors';
import express, { Application, Request, Response } from 'express';
import { userRoutes } from './app/Routes/user.route';


const app: Application = express();

//parsers
app.use(express.json());
app.use(cors());

// application routes
app.use("/api/v1/user", userRoutes);

const getAController = (req: Request, res: Response) => {
  const a = 10;
  res.send(a);
};

app.get('/', getAController);

export default app;
