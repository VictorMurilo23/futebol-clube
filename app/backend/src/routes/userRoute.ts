import * as express from 'express';
import tokenValidationMiddleware from '../middlewares/tokenValidationMiddleware';
import UserController from '../controllers/UserController';

const userController = new UserController();

const userRouter = express.Router();

userRouter.post('/', (req, res) => userController.login(req, res));

userRouter.get(
  '/validate',
  tokenValidationMiddleware,
  (req, res) => userController.validateRole(req, res),
);

export default userRouter;
