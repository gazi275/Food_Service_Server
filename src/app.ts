import cors from 'cors';
import cookieParser from "cookie-parser";
import express, { Application, Request, Response } from 'express';
import { userRoutes } from './app/Routes/user.route';
import { restaurantRoutes } from './app/Routes/resturant.route';
import { menuroutes } from './app/Routes/menu.route';
import { orderRoutes } from './app/Routes/order.route';

const app: Application = express();

// Define allowed origins
const allowedOrigins = ['http://localhost:5173', 'https://food-service-server-alpi.vercel.app/'];

// Configure CORS
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true, // Allow cookies/authorization headers if needed
  })
);
app.use(express.json({ limit: "10mb" })); // Adjust limit as needed
app.use(express.urlencoded({ limit: "10mb", extended: true }));
// Parsers
app.use(express.json());
app.use(cookieParser());
// Application routes
app.use('/api/v1/user', userRoutes);
app.use('/api/v1/resturant', restaurantRoutes);
app.use('/api/v1/menu', menuroutes);
app.use('/api/v1/order', orderRoutes);

// Default route
app.use('/', async (req: Request, res: Response) => {
  res.send('Server is running..!');
});

export default app;
