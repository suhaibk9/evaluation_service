export type submissionPayload = {
  code: string;
  language: string;
  // inputCase: string;
  // outputCase: string;
  testCases: Array<{ input: string; output: string }>;
};
