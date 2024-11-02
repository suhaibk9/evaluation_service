/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */

import createContainer from './containerFactory';
import { JAVA_IMAGE } from '../utils/constants';
import { fetchDecodedStream } from './dockerHelper';
import pullImage from './pullImage';
import CodeExecutorStrategy, {
  ExecutionResponse,
} from '../types/CodeExecutorStrategy';

class JavaExecutor implements CodeExecutorStrategy {
  async execute(
    code: string,
    inputTestCase: string,
    outputTestCase: string
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
      const codeResponse: ExecutionResponse = await fetchDecodedStream(
        loggerStream,
        rawBuffer
      );
      console.log('Final Code Response', codeResponse);
      if (codeResponse.output.trim() === outputTestCase.trim()) {
        return {
          output: codeResponse.output,
          status: 'Success',
        };
      } else {
        return {
          output: codeResponse.output,
          status: 'WA',
        }; //Wrong Answer
      }
    } catch (e: any) {
      if (e.status === 'TLE') {
        await javaDockerContainer.kill();
        return { output: 'Time limit exceeded', status: 'TLE' };
      }
      return { output: 'Error in executing Java code', status: 'error' };
    } finally {
      //Done with the stream now remove the container.
      javaDockerContainer.remove();
    }
  }
}

export default JavaExecutor;
