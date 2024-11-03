/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Job } from 'bullmq';

import { submissionPayload } from '../types/submissionPayload';
import { IJob } from '../types/bullMQJobDefinition';
import createExecutor from '../utils/ExecutorFactory';
import evaluationQueueProducer from '../producers/evaluationQueueProducer';
// import { ExecutionResponse } from '../types/CodeExecutorStrategy';

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
      evaluationQueueProducer(this.payload);
      const language = this.payload.language;
      const code = this.payload.code;
      const strategy = createExecutor(language);
      if (strategy !== null) {
        const results = this.payload.testCases.map(
          async ({ input, output }) => {
            const result = await strategy.execute(code, input, output);
            console.log('Test Case Result', result);
            return result;
          }
        );
        const finalStatus = finalResults(results);
        evaluationQueueProducer({
          response: finalStatus,
          problemId: this.payload.problemId,
          userId: this.payload.userId,
          submissionId: this.payload.submissionId,
        });
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

const finalResults = (results: any) => {
  let finalStatus = 'Success';

  for (const result of results) {
    console.log('Result Value', result);
    if (result.status === 'TLE') {
      finalStatus = 'TLE';
      break;
    } else if (result.status === 'error') {
      finalStatus = 'RE';
      break;
    } else if (result.status === 'WA') {
      finalStatus = 'WA';
    }
  }
  return finalStatus;
};
