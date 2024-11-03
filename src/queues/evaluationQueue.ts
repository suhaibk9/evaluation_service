import { Queue } from 'bullmq';

//evaluationQueue
const evaluationQueue = new Queue('evaluationQueue');
export default evaluationQueue;
