export type submissionPayload = {
  code: string;
  problemId: string;
  userId: string;
  submissionId: string;
  language: string;
  testCases: Array<{ input: string; output: string }>;
};

// onst addingToQueue = await submissionProducer('submission', {
//       code: submission.code,
//       problemId: submission.problemId,
//       userId: submission.userId,
//       submissionId: submission_repo._id,
//       language: submission.language,
//       testCases: problemDetails.data.testCases.map(({ input, output }) => ({
//         input,
//         output,
//       })),
