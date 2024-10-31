import submissionQueue from '../queues/submissionQueue';
const submissionQueueProducer = async (
  name: string,
  payload: Record<string, unknown>,
  priority: number = 0
) => {
  await submissionQueue.add(name, payload, { priority });
  console.log('Added a new Submission Job to the Queue');
};
export default submissionQueueProducer;
