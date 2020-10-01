import { Router } from 'express';

import authMiddleware from './app/middlewares/authMiddleware';

import SessionController from './controllers/SessionController';
import UserController from './controllers/UserController';

const routes = Router();

routes.post('/users/create', UserController.store);
routes.post('/session/new', SessionController.auth);
routes.get('/users/index', authMiddleware, SessionController.index);

export default routes;
