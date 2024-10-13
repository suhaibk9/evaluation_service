import { createBullBoard } from 'bull-board';
import { BullMQAdapter } from 'bull-board/bullMQAdapter';

import sampleQueue from '../queues/sampleQueue';
const { router } = createBullBoard([new BullMQAdapter(sampleQueue)]);
export default router;
