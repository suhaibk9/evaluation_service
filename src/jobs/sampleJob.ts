import { Job } from 'bullmq';

import { IJob } from '../types/bullMQJobDefinition';
class SampleJob implements IJob {
  name: string;
  payload: Record<string, unknown>;
  constructor(payload: Record<string, unknown>) {
    this.name = this.constructor.name;
    this.payload = payload;
  }
  handle(job?: Job): void {
    console.log(`Job ${job?.id} completed`);
    console.log('name: ', job?.name);
    console.log('data: ', job?.data);
  }
  failed(job?: Job) {
    console.log(`Job ${job?.id} failed`);
  }
}
export default SampleJob;
/**
 A job has properties:
    id: The id of the job.
    name: The name of the job.
    data: The data of the job.

 */