import express from 'express';
import { Express } from 'express';
import bodyParser from 'body-parser';

import SubmissionWorker from './workers/submissionWorker';
// import serverAdapter from './config/bullBoardConfig';
// import sampleQueueProducer from './producers/sampleQueueProducer';
import serverConfig from './config/serverConfig';
// import sampleWorker from './workers/sampleWorker';
import apiRouter from './routes/index';
// import runPython from './containers/runPythonDocker';
// import runJava from './containers/runJavaDocker';
// import runCpp from './containers/runCPPDocker';
// import submissionQueueProducer from './producers/submissionQueueProducer';
const app: Express = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// app.use('/ui', serverAdapter.getRouter());
app.use('/api', apiRouter);
app.listen(serverConfig.PORT, () => {
  console.log(`Server is running on port ${serverConfig.PORT}`);
  SubmissionWorker('submissionQueue');
});
