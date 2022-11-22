import * as express from 'express';
import UserController from '../controllers/UserController';

const userController = new UserController();

const userRouter = express.Router();

userRouter.post('/', (req, res) => userController.login(req, res));

export default userRouter;
