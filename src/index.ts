import express from 'express';
import { Express } from 'express';

import serverConfig from './config/serverConfig';
const app: Express = express();
app.use('/api', require('./routes/index'));
app.listen(serverConfig.PORT, () => {
  console.log(`Server is running on port ${serverConfig.PORT}`);
});
