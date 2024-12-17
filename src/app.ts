import cors from 'cors';
import cookieParser from "cookie-parser";
import express, { Application, Request, Response } from 'express';
import { userRoutes } from './app/Routes/user.route';
import { restaurantRoutes } from './app/Routes/resturant.route';
import { menuroutes } from './app/Routes/menu.route';
import { orderRoutes } from './app/Routes/order.route';

const app: Application = express();

// Define allowed origins (no trailing slash)
const allowedOrigins = [
  'https://foody-service.vercel.app',
  'https://food-service-server-alpi.vercel.app',
];

// Configure CORS
app.use(
  cors({
    origin: (origin, callback) => {
      console.log('Origin received:', origin); // Debugging origin
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.error('Blocked by CORS:', origin);
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true, // Allow cookies/authorization headers
    optionsSuccessStatus: 200, // For legacy browsers
  })
);

// Handle preflight OPTIONS requests
app.options('*', cors());

// Body parsers
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));
app.use(cookieParser());

// Application routes
app.use('/api/v1/user', userRoutes);
app.use('/api/v1/resturant', restaurantRoutes);
app.use('/api/v1/menu', menuroutes);
app.use('/api/v1/order', orderRoutes);

// Default route
app.get('/', async (req: Request, res: Response) => {
  res.send('Server is running..!');
});

export default app;
