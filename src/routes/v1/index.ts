import express from 'express';

import PingController from '../../controllers/pingControllers';
import submissionRouter from './submissionRoutes';
const router = express.Router();
router.get('/', PingController);
router.use('/submission', submissionRouter);
export default router;
