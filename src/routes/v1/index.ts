import express from 'express';

import PingController from '../../controllers/pingControllers';

const router = express.Router();
router.get('/', PingController);
module.exports = router;
