import cors from 'cors';
import express, { Application } from 'express';
import { userRoutes } from './app/Routes/user.route';
import { restaurantRoutes } from './app/Routes/resturant.route';
import { menuroutes } from './app/Routes/menu.route';
import { orderRoutes } from './app/Routes/order.route';


const app: Application = express();

//parsers
app.use(express.json());
app.use(cors());

// application routes
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/resturant", restaurantRoutes);
app.use("/api/v1/menu", menuroutes);
app.use("/api/v1/order", orderRoutes);





export default app;
