/* eslint-disable @typescript-eslint/no-unused-vars */
import createContainer from './containerFactory';
import { JAVA_IMAGE } from '../utils/constants';
import { decodeDockerStream } from './dockerHelper';
import pullImage from './pullImage';
import CodeExecutorStrategy, {
  ExecutionResponse,
} from '../types/CodeExecutorStrategy';

class JavaExecutor implements CodeExecutorStrategy {
  async execute(
    code: string,
    inputTestCase: string,
    outputTestCase:string
  ): Promise<ExecutionResponse> {
    console.log('OP', outputTestCase);
    await pullImage(JAVA_IMAGE);
    const rawBuffer: Buffer[] = [];
    const runCommand = `echo '${code.replace(
      /'/g,
      `'\\"`
    )}' > Main.java && javac Main.java && echo '${inputTestCase.replace(
      /'/g,
      `'\\"`
    )}' | java Main`;

    const javaDockerContainer = await createContainer(JAVA_IMAGE, [
      '/bin/sh',
      '-c',
      runCommand,
    ]);
    await javaDockerContainer.start();
    console.log('Java container started');

    const loggerStream = await javaDockerContainer.logs({
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
      // Done with the stream, now remove the container.
      await javaDockerContainer.remove();
      return codeResponse;
    } catch (e) {
      console.log(e);
    }
    return { output: 'Error in executing Java code', status: 'error' };
  }

  fetchDecodedStream(
    loggerStream: NodeJS.ReadableStream,
    rawBuffer: Buffer[]
  ): Promise<ExecutionResponse> {
    return new Promise((resolve, reject) => {
      loggerStream.on('end', () => {
        console.log('Java code execution completed');
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

export default JavaExecutor;
