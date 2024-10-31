/* eslint-disable @typescript-eslint/no-explicit-any */
import createContainer from './containerFactory';
import { PYTHON_IMAGE } from '../utils/constants';
import { decodeDockerStream } from './dockerHelper';
import pullImage from './pullImage';
import CodeExecutorStrategy, {
  ExecutionResponse,
} from '../types/CodeExecutorStrategy';
// import DockerStreamOutput from '../types/dockerStreamOutput';
class PythonExecutor implements CodeExecutorStrategy {
  async execute(
    code: string,
    inputTestCase: string
  ): Promise<ExecutionResponse> {
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
      const codeResponse: ExecutionResponse = await this.fetchDecodedStream(
        loggerStream,
        rawBuffer
      );
      //Done with the stream now remove the container.
      await pythonDockerContainer.remove();
      return codeResponse;
    } catch (e) {
      console.log(e);
    }
    return { output: 'Error in executing Python code', status: 'error' };
  }
  fetchDecodedStream(
    loggerStream: NodeJS.ReadableStream,
    rawBuffer: Buffer[]
  ): Promise<ExecutionResponse> {
    return new Promise((resolve, reject) => {
      loggerStream.on('end', () => {
        console.log('Python code execution completed');
        const completeBuffer = Buffer.concat(rawBuffer);
        const decodedString = decodeDockerStream(completeBuffer);
        console.log(decodedString.stdout);
        if (decodedString.stderr) {
          reject({ output: decodedString.stderr, status: 'error' });
        }
        resolve({ output: decodedString.stdout, status: 'success' });
      });
    });
  }
}

export default PythonExecutor;
