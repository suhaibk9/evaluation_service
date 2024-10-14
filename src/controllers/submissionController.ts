import { Request, Response } from 'express';

import { CreateSubmissionDto } from '../dtos/CreateSubmissionDto';

const addSubmission = async (req: Request, res: Response) => {

  //   try {

  //     const submissionDto = req.body as CreateSubmissionDto;
  //     return res.status(201).json({
  //       success: true,
  //       error: {},
  //       message: 'Submission created successfully',
  //       data: submissionDto,
  //     });
  //   } catch (error) {
  //     throw error;
  //   }
  const submissionDto = req.body as CreateSubmissionDto;
  return res.status(201).json({
    success: true,
    error: {},
    message: 'Submission created successfully',
    data: submissionDto,
  });
};
export { addSubmission };
