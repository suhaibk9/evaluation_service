import express from 'express';
import { Express } from 'express';

import router from './config/bullBoardConfig';
import sampleQueueProducer from './producers/sampleQueueProducer';
import serverConfig from './config/serverConfig';
import sampleWorker from './workers/sampleWorker';
const app: Express = express();
app.use('/queue/ui', router);
app.use('/api', require('./routes/index'));
app.listen(serverConfig.PORT, () => {
  console.log(`Server is running on port ${serverConfig.PORT}`);
  sampleQueueProducer(
    'SampleJob',
    {
      name: 'John Doe',
      compnay: 'Doe Inc',
      postion: 'Software Engineer',
      location: 'Lagos, Nigeria',
    },
    100
  );
  sampleQueueProducer(
    'SampleJob',
    {
      name: 'Jane Doe',
      compnay: 'Doe Inc',
      postion: 'Software Engineer',
      location: 'Lagos, Nigeria',
    },
    2
  );
  sampleWorker('sampleQueue');
});
