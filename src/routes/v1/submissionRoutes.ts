import express from 'express';

import { addSubmission } from '../../controllers/submissionController';
import { validate } from '../../validators/createSubmissionValidator';
import { createSubmissionZodSchema } from '../../dtos/CreateSubmissionDto';
const router = express.Router();
router.post('/', validate(createSubmissionZodSchema), addSubmission);
export default router;
