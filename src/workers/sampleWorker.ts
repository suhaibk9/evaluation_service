import { Job, Worker } from 'bullmq';

import SubmissionJob from '../jobs/submissionJob';
import redisConnection from '../config/redisConfig';

const submissionWorker = (queueName: string) => {
  return new Worker(
    queueName,
    async (job: Job) => {
      if (job.name === 'submission') {
        const submissionJobInstance = new SubmissionJob(job.data);
        try {
          await submissionJobInstance.handle(job); // Await the handle method
        } catch (error) {
          console.error(`Job ${job.id} failed:`, error);
          await submissionJobInstance.failed(job); // Call failed if needed
        }
      }
    },
    {
      connection: redisConnection,
    }
  );
};

export default submissionWorker;
