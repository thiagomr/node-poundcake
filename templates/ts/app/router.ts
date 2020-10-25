import express from 'express';
import controllers from '../controllers';

const router = express.Router();

router.get('/ping', controllers.mainController.ping);

export default router;
