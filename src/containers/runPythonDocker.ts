import createContainer from './containerFactory';
import { PYTHON_IMAGE } from '../utils/constants';
import { decodeDockerStream } from './dockerHelper';
const runPython = async (code: string, inputTestCase: string) => {
  const rawBuffer: Buffer[] = [];
  //   const pythonDockerContainer = await createContainer(PYTHON_IMAGE, [
  //     'python3',
  //     '-c',
  //     code,
  //     'stty -echo',
  //   ]);
  const runCommand = `echo '${code.replace(
    `'`,
    "'\\''"
  )}' > test.py && echo '${inputTestCase}' | python3 test.py`;

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
  //Done with the stream now remove the container.
  await new Promise((resolve) => {
    loggerStream.on('end', () => {
      console.log('Python code execution completed');
      const completeBuffer = Buffer.concat(rawBuffer);
      const decodedString = decodeDockerStream(completeBuffer);
      console.log(decodedString.stdout);
      resolve(decodedString.stdout);
    });
  });
  await pythonDockerContainer.remove();
  return pythonDockerContainer;
};
export default runPython;
