import sampleQueue from '../queues/sampleQueue';
const sampleQueueProducer = async (
  name: string,
  payload: Record<string, unknown>,
  priority: number = 0
) => {
  await sampleQueue.add(name, payload, { priority });
};
export default sampleQueueProducer;
/**
 here name is the name of the job and payload is the data that the job will process.
 */
