import { Job } from 'bullmq';

import { submissionPayload } from '../types/submissionPayload';
import { IJob } from '../types/bullMQJobDefinition';
import createExecutor from '../utils/ExecutorFactory';
class SubmissionJob implements IJob {
  name: string;
  payload: submissionPayload;
  constructor(payload: submissionPayload) {
    this.name = this.constructor.name;
    this.payload = payload;
  }
  handle(job?: Job): void {
    if (job) {
      console.log('Full Payload', this.payload);
      const language = this.payload.language;
      const code = this.payload.code;
      // const testCases = this.payload.testCases;
      // const inputCase = this.payload.inputCase;
      // const outputCase = this.payload.outputCase;
      const strategy = createExecutor(language);
      if (strategy !== null) {
        const results = this.payload.testCases.map(
          async ({ input, output }) => {
            const result = await strategy.execute(code, input, output);
            console.log('Test Case Result', result);
            return result;
          }
        );
        console.log('All Results', results);
      }
    }
  }
  failed(job?: Job) {
    console.log(`Job ${job?.id} failed`);
  }
}
export default SubmissionJob;
/**
 A job has properties:
    id: The id of the job.
    name: The name of the job.
    data: The data of the job.

 */
