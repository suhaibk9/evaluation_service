import express from 'express';
const apiRouter = express.Router();
apiRouter.use('/v1', require('./v1'));
module.exports = apiRouter;
