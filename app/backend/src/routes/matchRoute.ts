import * as express from 'express';
import tokenValidationMiddleware from '../middlewares/tokenValidationMiddleware';
import MatchController from '../controllers/MatchController';

const matchController = new MatchController();

const matchRouter = express.Router();

matchRouter.get('/', (req, res) => matchController.getAll(req, res));

matchRouter.patch('/:id/finish', (req, res) => matchController.finishMatch(req, res));

matchRouter.post('/', tokenValidationMiddleware, (req, res) => matchController.create(req, res));
export default matchRouter;
