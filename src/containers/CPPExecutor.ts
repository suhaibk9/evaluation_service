import createContainer from './containerFactory';
import { CPP_IMAGE } from '../utils/constants';
import { decodeDockerStream } from './dockerHelper';
import pullImage from './pullImage';
import CodeExecutorStrategy, {
  ExecutionResponse,
} from '../types/CodeExecutorStrategy';

class CppExecutor implements CodeExecutorStrategy {
  async execute(
    code: string,
    inputTestCase: string
  ): Promise<ExecutionResponse> {
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
      const codeResponse: string = await this.fetchDecodedStream(
        loggerStream,
        rawBuffer
      );
      console.log('codeResponse', codeResponse);
      return { output: codeResponse, status: 'success' };
    } catch (e) {
      console.log(e);
      return { output: 'Error in executing C++ code', status: 'error' };
    } finally {
      // Done with the stream, now remove the container.
      await cppDockerContainer.remove();
    }
  }

  fetchDecodedStream(
    loggerStream: NodeJS.ReadableStream,
    rawBuffer: Buffer[]
  ): Promise<string> {
    return new Promise((resolve, reject) => {
      loggerStream.on('end', () => {
        console.log('C++ code execution completed');
        const completeBuffer = Buffer.concat(rawBuffer);
        const decodedString = decodeDockerStream(completeBuffer);
        console.log(decodedString.stdout);
        if (decodedString.stderr) {
          reject(decodedString.stderr);
        } else {
          resolve(decodedString.stdout);
        }
      });
    });
  }
}

export default CppExecutor;
