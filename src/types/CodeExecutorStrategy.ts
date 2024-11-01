export default interface CodeExecutorStrategy {
  execute(
    code: string,
    inputTestCase: string,
    outputTestCas: string
  ): Promise<ExecutionResponse>;
}

export type ExecutionResponse = { output: string; status: string };
