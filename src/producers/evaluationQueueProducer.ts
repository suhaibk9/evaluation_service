// import sampleQueue from '../queues/sampleQueue';
// const sampleQueueProducer = async (
//   name: string,
//   payload: Record<string, unknown>,
//   priority: number = 0
// ) => {
//   await sampleQueue.add(name, payload, { priority });
// };
// export default sampleQueueProducer;

import evaluationQueue from '../queues/evaluationQueue';
const evaluationQueueProducer = async (
  payload: Record<string, unknown>, //This means that the payload is an object with string keys and unknown values. example: { name: 'John Doe', age: 30 }
  priority = 1, //This means that the priority is a number with a default value of 1
  name = 'evaluationJob' //This means that the name is a string with a default value of 'evaluationJob'
) => {
  await evaluationQueue.add(name, payload, { priority });
  console.log('Successfully added a new Job to the evaluation queue');
};
export default evaluationQueueProducer;
