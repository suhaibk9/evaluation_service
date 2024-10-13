import { Job, Worker } from 'bullmq';

import SampleJob from '../jobs/sampleJob';
import redisConnection from '../config/redisConfig';

const sampleWorker = (queueName: string) => {
return new Worker(
    queueName,
    async (job: Job) => {
      if (job.name === 'SampleJob') {
        const sampleJobInstance = new SampleJob(job.data);
        try {
          await sampleJobInstance.handle(job); // Await the handle method
        } catch (error) {
          console.error(`Job ${job.id} failed:`, error);
          await sampleJobInstance.failed(job); // Call failed if needed
        }
      }
    },
    {
      connection: redisConnection,
    }
  );
};

export default sampleWorker;
