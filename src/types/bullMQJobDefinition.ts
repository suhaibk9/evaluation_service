import { Job } from 'bullmq';
export interface IJob {
  name: string; // name is the name of the job.
  payload?: Record<string, unknown>; // payload is the data that the job will process. This is the data consumed by the worker.
  handle: (job?: Job) => void; // handle is the function that will be executed when the job is processed.
  failed: (job?: Job) => void; // failed is the function that will be executed when the job fails.
}
//This is the Strucutre of a Job from the Producer.

/**
 Like in case of a mailer queue:
 name -> name of the job
 payload -> will contain data like to, from, subject, body etc
 handle -> when consumer picks the job from the queue how to process it or which algorithm to use to process it, it will be done  by the hanler function.
 failed -> if the job fails then what to do, this is the function that will be executed when the job fails.
 */
