import * as express from 'express';
import MatchController from '../controllers/MatchController';

const matchController = new MatchController();

const matchRouter = express.Router();

matchRouter.get('/', (req, res) => matchController.getAll(req, res));

matchRouter.post('/', (req, res) => matchController.create(req, res));

matchRouter.patch('/:id/finish', (req, res) => matchController.finishMatch(req, res));

export default matchRouter;
