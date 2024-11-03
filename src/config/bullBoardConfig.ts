// /* eslint-disable import/order */
// /* eslint-disable @typescript-eslint/no-unused-vars */
// import { createBullBoard } from '@bull-board/api';
// import { BullMQAdapter } from '@bull-board/api/bullMQAdapter';
// import { ExpressAdapter } from '@bull-board/express';
// import evaluationQueue from '../queues/evaluationQueue';
// import submissionQueue from '../queues/submissionQueue';
// console.log('BullBoard UI route set up at /queue/ui');
// const serverAdapter = new ExpressAdapter();
// serverAdapter.setBasePath('/ui');

// const queues = [new BullMQAdapter(evaluationQueue), new BullMQAdapter(submissionQueue)];
// createBullBoard({ queues: queues, serverAdapter: serverAdapter });
// export default serverAdapter;
