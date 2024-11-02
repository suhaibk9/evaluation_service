import { Queue } from 'bullmq';
const evaluationQueue = new Queue('evaluationQueue');
export default evaluationQueue;
