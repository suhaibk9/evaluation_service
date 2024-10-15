import createContainer from './containerFactory';
import { CPP_IMAGE } from '../utils/constants';
import { decodeDockerStream } from './dockerHelper';
import pullImage from './pullImage';

const runCpp = async (code: string, inputTestCase: string) => {
  await pullImage(CPP_IMAGE);
  const rawBuffer: Buffer[] = [];

  // Command to compile and run the C++ code
  const runCommand = `echo '${code.replace(
    `'`,
    "'\\''"
  )}' > main.cpp && g++ main.cpp -o main && echo '${inputTestCase}' | ./main`;

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

  // Done with the stream now, remove the container.
  await new Promise((resolve) => {
    loggerStream.on('end', () => {
      console.log('C++ code execution completed');
      const completeBuffer = Buffer.concat(rawBuffer);
      const decodedString = decodeDockerStream(completeBuffer);
      console.log(decodedString);
      resolve(decodedString);
    });
  });

  await cppDockerContainer.remove();
  return cppDockerContainer;
};

export default runCpp;
