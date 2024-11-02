/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import createContainer from './containerFactory';
import { PYTHON_IMAGE } from '../utils/constants';
// import { decodeDockerStream } from './dockerHelper';
import { fetchDecodedStream } from './dockerHelper';
import pullImage from './pullImage';
import CodeExecutorStrategy, {
  ExecutionResponse,
} from '../types/CodeExecutorStrategy';
// import DockerStreamOutput from '../types/dockerStreamOutput';
class PythonExecutor implements CodeExecutorStrategy {
  async execute(
    code: string,
    inputTestCase: string,
    outputTestCase: string
  ): Promise<ExecutionResponse> {
    console.log('OP', outputTestCase);
    await pullImage(PYTHON_IMAGE);
    const rawBuffer: Buffer[] = [];
    const runCommand = `echo '${code.replace(
      /'/g,
      `'\\"`
    )}' > test.py && echo '${inputTestCase.replace(
      /'/g,
      `'\\"`
    )}' | python3 test.py`;
    const pythonDockerContainer = await createContainer(PYTHON_IMAGE, [
      '/bin/sh',
      '-c',
      runCommand,
    ]);
    await pythonDockerContainer.start();
    console.log('Python container started');
    const loggerStream = await pythonDockerContainer.logs({
      timestamps: false,
      follow: true,
      stdout: true,
      stderr: true,
    });
    loggerStream.on('data', (chunk) => {
      rawBuffer.push(chunk);
    });

    try {
      const codeResponse: ExecutionResponse = await fetchDecodedStream(
        loggerStream,
        rawBuffer
      );

      console.log('Final Code Response', codeResponse);
      if (codeResponse.output.trim() === outputTestCase.trim()) {
        return {
          output: codeResponse.output,
          status: 'Success',
        }; //Success
      } else {
        return {
          output: codeResponse.output,
          status: 'WA',
        }; //Wrong Answer
      }
    } catch (e: any) {
      if (e.status === 'TLE') {
        await pythonDockerContainer.kill();
        return { output: 'Time limit exceeded', status: 'TLE' };
      }
      return { output: 'Error in executing Python code', status: 'error' };
    } finally {
      pythonDockerContainer.remove();
    }
  }
}

export default PythonExecutor;
