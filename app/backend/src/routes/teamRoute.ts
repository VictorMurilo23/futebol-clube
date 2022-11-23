import * as express from 'express';
import TeamController from '../controllers/TeamController';

const teamController = new TeamController();

const teamRouter = express.Router();

teamRouter.get('/', (req, res) => teamController.getAll(req, res));

export default teamRouter;
