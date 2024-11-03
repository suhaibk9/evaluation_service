/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import createContainer from './containerFactory';
import { CPP_IMAGE } from '../utils/constants';
// import { decodeDockerStream } from './dockerHelper';
import { fetchDecodedStream } from './dockerHelper';
import pullImage from './pullImage';
import CodeExecutorStrategy, {
  ExecutionResponse,
} from '../types/CodeExecutorStrategy';
import evaluationQueueProducer from '../producers/evaluationQueueProducer';
class CppExecutor implements CodeExecutorStrategy {
  async execute(
    code: string,
    inputTestCase: string,
    outputTestCase: string
  ): Promise<ExecutionResponse> {
    console.log('OP', outputTestCase);
    await pullImage(CPP_IMAGE); // Ensure the image is pulled before execution
    const rawBuffer: Buffer[] = [];
    const runCommand = `echo '${code.replace(
      /'/g,
      `'\\"`
    )}' > main.cpp && g++ main.cpp -o main && echo '${inputTestCase.replace(
      /'/g,
      `'\\"`
    )}' | ./main`;

    const cppDockerContainer = await createContainer(CPP_IMAGE, [
      '/bin/sh',
      '-c',
      runCommand,
    ]);

    await cppDockerContainer.start();
    console.log('C++ container started');

    const loggerStream = await cppDockerContainer.logs({
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
      evaluationQueueProducer({ codeResponse });
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
        
        await cppDockerContainer.kill();
        return { output: 'Time limit exceeded', status: 'TLE' };
      }
      return { output: 'Error in executing C++ code', status: 'error' };
    } finally {
      cppDockerContainer.remove();
    }
  }
}

export default CppExecutor;
