import { Router } from 'express';
import userRouter from './userRoutes';
import authMiddleware from './../middlewares/authMiddleware';

const routes = Router();

// Public routes.
routes.use('/users', userRouter);

// Protected routes. All routes defined after this will be protected.
routes.use(authMiddleware);

export default routes;
