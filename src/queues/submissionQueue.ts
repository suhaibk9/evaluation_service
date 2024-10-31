import { Queue } from "bullmq";
const submissionQueue = new Queue('submissionQueue');
export default submissionQueue;